import jsforce from 'jsforce';
import axios from 'axios';
import _ from 'underscore';
import assert from 'node:assert/strict';
import getUser from './getUser.js';

var connections = new Map();

export function addConnection(userName,{rest,soap,restRoot}) {
    //logger(`${userName}.restRoot: ${restRoot}`);
    connections[userName] = {rest,soap,restRoot};
}

export function getAdminConnection() {
    if(connections.has('Admin')) return connections.get('Admin');
    throw new Error(`No admin connections to get from getAdminConnection(), only: ${_.keys(connections)}`);
}

export function getConnections() {
    return connections;
}

export function resetConnections() {
    connections = new Map();
}

export async function connectAsUsers(users) {
    var users = _.map(users,getUser);
    for(const user of users) {
        const conn = await connectAs(user);
        conn[`limits`] = await getLimits(conn,[`DailyApiRequests`,`DataStorageMB`,`DailyFunctionsApiCallLimit`]);
        connections.set(user.name,conn);
    }
    return connections;
}

export async function connectAs(userData) {
    // assertions
    console.log(userData);
    assert.ok(_.has(userData,`loginUrl`),`User has no loginUrl`);
    assert.ok(_.has(userData,`username`),`User has no username`);
    assert.ok(_.has(userData,`password`),`User has no password`);
    // ----------
    var soap = new jsforce.Connection({
        oauth2: {
            loginUrl: userData.loginUrl
        }
    });

    var loginResponse = await soap.login(userData.username, userData.password);
    console.log(`connected as Id: ${loginResponse.id}`);
    
    var rest = await axios.create({
        baseURL: soap.instanceUrl,
        timeout: 50000,
        headers: {
            'Authorization':`Bearer ${soap.accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept':'application/json'
        }
    });
    var user = {...userData,...loginResponse,soap,rest};
    // do versions
    const { data: versionData } = await rest.get(userData.restRoot);
    const {label,url,version} = _.last(versionData);
    user.versionLabel = label;
    user.restRoot = url;
    user.version = version;
    return user;
}

export async function getLimits(connection,keepLimits) {
    var rest = connection.rest;
    var limitPath = `${connection.restRoot}/limits`;
    const { data: limitData } = await rest.get(limitPath);
    return _.pick(limitData,keepLimits);
}

export async function getMultipleDescribeMetadatas(rawTable) {
    const objects = _.flatten(rawTable);
    var userObjectRTIs = {};
    var regressionLayoutRows = [];
    const connections = connectionManager.getConnections();
    for(const username of Object.keys(connections)) {
        const connect = connections[username];
        assert.ok(connect);

        // get Meta for objects
        for(const object of objects) {
            const describe = await describeSObjectREST(connect,object);
            
            
            // The Describe responses are different for each user so each user/object response
            // is saved in the store's state[`recordTypeInfos`] property under a unique unameObjectId property
            // this loop creates that list.
            if(describe['recordTypeInfos']) {
                userObjectRTIs[unameObjectId] = _.map(describe['recordTypeInfos'],(rti) => {
                    const {name,developerName,urls} = rti;
                    const layouturl = urls.layout;
                    return {name,developerName,layouturl};
                });
            } else {
                assert.fail(`${object} describe response did not have a "recordTypeInfos" property.`);
            }

            // Does basically what we're doing above only it saves the object and recordtypename together
            // as [<Object Name>, <Record Type Name>] 
            // The reason for this is it makes it easy to go directly from the step in the feature file:
            //      And I view the Page Layouts for the following Objects' Record types:
			//          | Lead | CON_Sales_Lead                        |
            // That happens in in viewPageLayoutForObjectsRecTypes().
            // So it's the same metadata but being transformed in two different ways for two different purposes.
            if(describe['recordTypeInfos']) {
                const rows = _.map(describe['recordTypeInfos'],(rti) => {
                    const {developerName} = rti;
                    return [object,developerName]; 
                });
                regressionLayoutRows.push(...rows);
            } else {
                assert.fail(`${object} describe response did not have a "recordTypeInfos" property.`);
            }
        }
    }

    // save recordTypeInfos
    if(!_.isEmpty(userObjectRTIs)) store.dispatch(mdtSlice.saveRecordTypeInfos(userObjectRTIs));
    if(_.size(regressionLayoutRows) > 0) store.dispatch(mdtSlice.saveRegressionLayoutRows(regressionLayoutRows));
}

export async function describeSObjectREST(connection,sobject) {
    //DescribeSObjectResult
    var rest = connection.rest;
    var describeObjectPath = `${connection.restRoot}/sobjects/${sobject}/describe`;
    const { data:describeSobjectResult } = await rest.get(describeObjectPath);
    return describeSobjectResult;
}

export async function readProfilesMetadata(profile) {
    assert.ok(!_.isArray(profile),`function readProfilesMetadata() takes one profile at a time not an array, you put: ${profile}`);
    logger(`readProfilesMetadata(${profile})`);
    var adminConnection = connectionManager.getAdminConnection();
    var { soap } = adminConnection;
    for(let i = 0; i < 5; i++) {
        try {
            var rawResponse = await soap.metadata.read('Profile', [profile]);
            if(rawResponse) break;
        } catch(e) {
            console.log(e.code);
        }
    }
    var fullName = rawResponse['fullName'];
    console.log(fullName);

}

export function createListMetadataQueries(types) {
    return _.map(types,(t) => {
        return {'type':t, folder: null};
    });
}

export async function listMetadata(types) {
    var { soap,version } = connections.get(`Admin`);
    var queries = createListMetadataQueries(types);
    for(let i = 0; i < 3; i++) {
        try {
            var results = await soap.metadata.list(queries, version); 
            if(results) break;
        } catch(e) {
            //console.log(e.code);
        }
    }
    return _.groupBy(results, function(res){ return res.type });
}
