import jsforce from 'jsforce';
import axios from 'axios';
import _ from 'underscore';
import assert from 'node:assert/strict';
import userlist from './users.js';
import fs from 'fs/promises';

var connections = {};
var adminSymbol = Symbol("Admin");

export function getAdminSymbol() {
    return adminSymbol;
}

export async function addAdminConnection() {
    var adminuser = await connectAs(userlist['Admin']);
    connections[adminSymbol] = adminuser;
}

export function getAdminConnection() {
    const a = getAdminSymbol();
    return connections[a];
}

export function addMockAdminConnection(mock) {
    connections[adminSymbol] = mock;
}

export async function connectAs(userData) {
    // assertions
    assert.ok(_.has(userData,`loginUrl`),`User has no loginUrl`);
    assert.ok(_.has(userData,`username`),`User has no username`);
    assert.ok(_.has(userData,`password`),`User has no password`);
    assert.ok(_.has(userData,`profile`),`User has no password`);
    // ----------
    var soap = new jsforce.Connection({
        oauth2: {
            loginUrl: userData.loginUrl
        }
    });

    var loginResponse = await soap.login(userData.username, userData.password);
    //console.log(`connected as Id: ${loginResponse.id}`);
    
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

export function getConnections() {
    return connections;
}

export function resetConnections() {
    connections = {};
}

export async function getLimits(connection,keepLimits) {
    var rest = connection.rest;
    var limitPath = `${connection.restRoot}/limits`;
    const { data: limitData } = await rest.get(limitPath);
    return _.pick(limitData,keepLimits);
}

// export async function getMultipleDescribeMetadatas(rawTable) {
//     const objects = _.flatten(rawTable);
//     var userObjectRTIs = {};
//     var regressionLayoutRows = [];
//     const connections = getConnections();
//     for(const username of Object.keys(connections)) {
//         const connect = connections[username];
//         assert.ok(connect);

//         // get Meta for objects
//         for(const object of objects) {
//             const describe = await describeSObjectREST(connect,object);
            
            
//             // The Describe responses are different for each user so each user/object response
//             // is saved in the store's state[`recordTypeInfos`] property under a unique unameObjectId property
//             // this loop creates that list.
//             if(describe['recordTypeInfos']) {
//                 userObjectRTIs[unameObjectId] = _.map(describe['recordTypeInfos'],(rti) => {
//                     const {name,developerName,urls} = rti;
//                     const layouturl = urls.layout;
//                     return {name,developerName,layouturl};
//                 });
//             } else {
//                 assert.fail(`${object} describe response did not have a "recordTypeInfos" property.`);
//             }

//             // Does basically what we're doing above only it saves the object and recordtypename together
//             // as [<Object Name>, <Record Type Name>] 
//             // The reason for this is it makes it easy to go directly from the step in the feature file:
//             //      And I view the Page Layouts for the following Objects' Record types:
// 			//          | Lead | CON_Sales_Lead                        |
//             // That happens in in viewPageLayoutForObjectsRecTypes().
//             // So it's the same metadata but being transformed in two different ways for two different purposes.
//             if(describe['recordTypeInfos']) {
//                 const rows = _.map(describe['recordTypeInfos'],(rti) => {
//                     const {developerName} = rti;
//                     return [object,developerName]; 
//                 });
//                 regressionLayoutRows.push(...rows);
//             } else {
//                 assert.fail(`${object} describe response did not have a "recordTypeInfos" property.`);
//             }
//         }
//     }

//     // save recordTypeInfos
//     if(!_.isEmpty(userObjectRTIs)) store.dispatch(mdtSlice.saveRecordTypeInfos(userObjectRTIs));
//     if(_.size(regressionLayoutRows) > 0) store.dispatch(mdtSlice.saveRegressionLayoutRows(regressionLayoutRows));
// }

export async function describeSObjectREST(connection,sobject) {
    //DescribeSObjectResult
    var rest = connection.rest;
    var describeObjectPath = `${connection.restRoot}/sobjects/${sobject}/describe`;
    const { data:describeSobjectResult } = await rest.get(describeObjectPath);
    return describeSobjectResult;
}

export function createlistMetadataSOAPQueries(types) {
    return _.map(types,(t) => {
        return {'type':t, folder: null};
    });
}

export async function listMetadataSOAP(mdtTypes) {
    assert.ok(Array.isArray(mdtTypes));
    var isDefined = _.negate(_.isUndefined);
    var { soap,version,isTest } = getAdminConnection();
    var queries = createlistMetadataSOAPQueries(mdtTypes);
    for(let i = 0; i < 3; i++) {
        try {
            var results = await soap.metadata.list(queries, version);
            if(results) {
                assert.ok(Array.isArray(results));
                assert.ok(results.every((res) => isDefined(res)));
                break;
            }
        } catch(e) {
            console.log(e);
        }
    }
    
    // listedmdt 
    // {
    //     'CustomObject':[
    //         // {
    //         //     createdById: '0058c000009UrHiAAK',
    //         //     createdByName: 'Maximilian Bisesi',
    //         //     createdDate: '1970-01-01T00:00:00.000Z',
    //         //     fileName: 'objects/Customer.object',
    //         //     fullName: 'Customer',
    //         //     id: '',
    //         //     lastModifiedById: '0058c000009UrHiAAK',
    //         //     lastModifiedByName: 'Maximilian Bisesi',
    //         //     lastModifiedDate: '1970-01-01T00:00:00.000Z',
    //         //     namespacePrefix: '',
    //         //     type: 'CustomObject'
    //         //   },
    //         // ....
    //     ],
    //     'Profile': [
    //         ...
    //     ]
    // }

    // listedmdt ^^^
    var listedmdt = _.groupBy(results, function(res){ return res.type });
    // assert.ok(_.size(Object.keys(listedmdt)) == _.size(mdtTypes));
    return listedmdt;
}

export async function readMetadataSOAP(mdtType,fullNames) {
    assert.ok(typeof mdtType == 'string');
    assert.ok(Array.isArray(fullNames));
    // {
    //     'CustomObject':[
    //         'Customer',
    //          'Account',
    //          'Contact'
    //     ],
    //     'Profile': [
    //         'High Volume Customer Portal User',
    //          'Silver Partner User'
    //     ]
    // }
    // const fullNames = [ 'Account', 'Contact' ];
    // const metadata = await conn.metadata.read('CustomObject', fullNames);

    var { soap,version,isTest } = getAdminConnection();
    var mdt = await soap.metadata.read(mdtType,fullNames);

    var fullNameResults = _.map(mdt,(el,ind,arr) => el.fullName);
    assert.ok(_.every(fullNames,(fn) => fullNameResults.includes(fn)));

    var allExpectedProps = [
        `fullName`,`applicationVisibilities`,`custom`,`classAccesses`,`externalDataSourceAccesses`,`fieldPermissions`,
        `flowAccesses`,`layoutAssignments`,`objectPermissions`,`objectPermissions`,`recordTypeVisibilities`,
        `tabVisibilities`,`userLicense`,`userPermissions`,`categoryGroupVisibilities`,`customMetadataTypeAccesses`,`customPermissions`,
        `loginIpRanges`,`pageAccesses`,`profileActionOverrides`
    ];

    assert.ok( _.every( Object.keys(_.first(mdt)), (prop) => {
        //console.log(prop);
        return allExpectedProps.includes(prop);
    }));
            
    return mdt;
}
