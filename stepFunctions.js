/* eslint-disable no-empty */
import * as mdtSlice from '../api/metadataSlice.js';
import * as selectors from '../api/selectors.js';
import * as connectionManager from '../api/connectionManager.js';
import _ from 'underscore';
import store from '../api/store.js';
import getUser from '../api/getUser.js';
import assert from 'node:assert/strict';
import { getSectionsAndFields,getRelatedListColumnLabels,getRectypeLayoutForUsername } from '../api/layoutSelectors.js';
import { compareLayoutRows,compareLayoutRowsRequired,compareRelatedListColumns } from '../api/utils.js';
import { logger, compareArrays,getFLSColumn } from '../api/utils.js';


export async function viewPageLayoutForObjectsRecTypes(rawTable) {
    // convert rec types to dev names 
    const connections = connectionManager.getConnections();
    for(const [username,{rest}] of Object.entries(connections)) {
        for(const row of rawTable) {
            const [sobjectName,rtname] = row;
            const id = selectors.selectIdByLookupObject(store.getState(),[username,sobjectName]);
            assert.ok(id,`userobjectid ${id} not found for [${username},${sobjectName}]`);
            const rtis = selectors.selectUserRecTypeInfo(store.getState(),id);
            const { layouturl } = _.find(rtis,(rt) => rt.name == rtname || rt.developerName == rtname);
            const { data:layoutResponse } = await rest.get(layouturl);
            store.dispatch(mdtSlice.storeLayoutResonse({id,rtname,layoutResponse}));
        }
    }
}

export function validateRecordTypePageLayout(rectypeDeveloperName,rawTable) {
    const connections = connectionManager.getConnections();
    for(const username of Object.keys(connections)) {
        const layout = getRectypeLayoutForUsername(username,rectypeDeveloperName)
        assert.ok(layout,`no rectype layout found for ${username} ${rectypeDeveloperName}`);
        const actualSections = getSectionsAndFields(layout.detailLayoutSections,['label','required']);
        // // compareLayoutRows(actual, expected)
        compareLayoutRows(actualSections, rawTable); 
    }
}

export function validateRelatedListHasColumns(rectypeDeveloperName,objectname,expectedColumns) {
    const connections = connectionManager.getConnections();
    for(const username of Object.keys(connections)) {
        const layout = getRectypeLayoutForUsername(username,rectypeDeveloperName)
        assert.ok(layout,`no rectype layout found for ${username} ${rectypeDeveloperName}`);
        const lists = getRelatedListColumnLabels(layout[`relatedLists`]);
        const result = _.find(lists, (l) => l.name === objectname);
        if (!result) {
        throw new Error(`Related list with name ${objectname} not found for rectype ${rectypeDeveloperName}`);
        }
        const { columns:actualColumns } = result;
        compareRelatedListColumns(actualColumns,expectedColumns);
    }
}

export function validateRecordTypePageLayoutRequiredFields(rectypeDeveloperName,rawTable) {
    const connections = connectionManager.getConnections();
    for(const username of Object.keys(connections)) {
        const layout = getRectypeLayoutForUsername(username,rectypeDeveloperName)
        assert.ok(layout,`no rectype layout found for ${username} ${rectypeDeveloperName}`);
        const actualSections = getSectionsAndFields(layout.detailLayoutSections,['label','required']);
        // // compareLayoutRows(actual, expected)
        compareLayoutRowsRequired(actualSections, rawTable); 
    }
}

// export function compareRecTypeFieldColumnsRequired(rectypeDeveloperName,rawTable) {
//     // Comment #2 
//     const connections = connectionManager.getConnections();
//     const state = store.getState();
//     for(const username of Object.keys(connections)) {
//         const id = selectors.selectIdByUsername(state,username);
//         assert.ok(id,`compareRecTypeFieldColumnsRequired() no id found: ${id}`);
//         const layouts = selectors.selectRecTypeLayoutsById(state,id);
//         const rectypelayout = layouts[rectypeDeveloperName];
//         assert.ok(rectypelayout,`no rectype layout found for ${id} ${rectypeDeveloperName}`);
//         const actualSections = getSectionsAndFields(rectypelayout.detailLayoutSections,['label', 'required']);
//         compareLayoutRowsRequired(actualSections, rawTable); 
//     }
// }





export function theProfilesFLSIs(profile,object,rawTable) {
    // state.profiles[fullName][`fls`][object] selectors
    const actualFLS = selectors.selectProfileObjectFLS(store.getState(),profile);
    assert.ok(actualFLS,`No FLS selected for ${object}`);

    var expectedFLS = _.chain(rawTable)
                        .slice(1)
                        .flatten()
                        .chunk(2)
                        .value();

    logger(`theProfilesFLSIs() - actualFLS: ${JSON.stringify(actualFLS)}`, true);
    logger(`theProfilesFLSIs() - expectedFLS: ${JSON.stringify(expectedFLS)}`, true);
    
    // get object fls immutably
    var actualFields = _.map(actualFLS[object],(flsRow) => flsRow.slice(0));
    const actualReadOnly = getFLSColumn(actualFields,'Read Only');
    const actualFullAccess = getFLSColumn(actualFields,'Full Access');
    const actualNoAccess = getFLSColumn(actualFields,'No Access');

    const expectedReadOnly = getFLSColumn(expectedFLS,'Read Only');
    const expectedFullAccess = getFLSColumn(expectedFLS,'Full Access');
    const expectedNoAccess = getFLSColumn(expectedFLS,'No Access');
    var pass = true;
    var testResult = `\n\nFLS for ${profile} ${object}\n---------------------\n`;
    try {
        // Read Only fls test
        compareArrays(actualReadOnly,expectedReadOnly);
    } catch(e) {
        logger(`Read Only: ${e}`);
        console.log(e);
        pass = false;
        const errorMess = `${e}`;
        testResult += `Read Only:${errorMess.replace('Error: ', '\n')}\n`;
    }

    try {
        // Full Access fls test
        compareArrays(actualFullAccess,expectedFullAccess);
    } catch(e) {
        logger(`Full Access: ${e}`);
        console.log(e);
        pass = false;
        const errorMess = `${e}`;
        testResult += `Full Access:${errorMess.replace('Error: ', '\n')}\n`; 
    }

    try {
        // No Access fls test
        compareArrays(actualNoAccess,expectedNoAccess);
    } catch(e) {
        logger(`No Access: ${e}`);
        console.log(e);
        pass = false;
        const errorMess = `${e}`;
        testResult += `No Access:${errorMess.replace('Error: ', '\n')}\n`;
    }
    testResult += `---------------------\n`;
    if(!pass) throw new Error(testResult);
}

export async function readPermissionSetMetadata(profile) {
    assert.ok(!_.isArray(profile),`function readProfilesMetadata() takes one profile at a time not an array, you put: ${profile}`);
    logger(`readProfilesMetadata(${profile})`);
    const adminConnection = connectionManager.getAdminConnection();
    var { soap } = adminConnection;
    for(let i = 0; i < 5; i++) {
        try {
            var rawResponse = await soap.metadata.read('Profile', [profile]);
            if(rawResponse) break;
        } catch(e) {
            console.log(e.code);
        }
    }
    const fullName = rawResponse['fullName'];
    console.log(`read metadata for profile fullName: ${fullName}`);
    logger(`read metadata for profile fullName: ${fullName}`);
    store.dispatch(mdtSlice.storeProfileMetadata(rawResponse),true);
}

export function profileHasFLSForField(access,table) {
    const objects = _.map(table,_.first);
    var fls = selectors.selectFLSByMutlipeObjects(store.getState(),objects);
    for(const row of table){
        const [object,field] = row;
        for(const profile of Object.keys(fls)) {
            const actualRow = _.find(fls[profile][object],(accessRow) => _.first(accessRow) == field);
            if(_.isUndefined(actualRow)) {
                logger(fls[profile][object]);
                throw new Error(`No FLS row found for ${profile}, ${object}.${field}`);
            }
            if(actualRow[1] !== access) throw new Error(`FLS doesn't match for ${profile}, ${object}.${field}: ${actualRow[1]} != ${access}`);
        }
    }
}

export function relatedListHasColumns(rectypeDeveloperName,objectname,expectedColumns) {
    const connections = connectionManager.getConnections();
    const state = store.getState();
    for(const username of Object.keys(connections)) {
        const id = selectors.selectIdByUsername(state,username);
        assert.ok(id,`compareRecTypeFieldColumns() no id found: ${id}`);
        const layouts = selectors.selectRecTypeLayoutsById(state,id);
        const rectypelayout = layouts[rectypeDeveloperName];
        assert.ok(id,`relatedListHasColumns() no id found: ${id}`);
        const lists = getRelatedListColumnLabels(rectypelayout.relatedLists);
        const { columns:actualColumns } = _.find(lists,(l) => l.name == objectname);
        compareRelatedListColumns(actualColumns,expectedColumns);
    }
}

export function theProfileHasTheFLS(profile,object,rawTable) {
    // state.profiles[fullName][`fls`][object] selectors
    const actualFLS = selectors.selectProfileObjectFLS(store.getState(),profile);
    assert.ok(actualFLS,`No FLS selected for ${object}`);
    assert.ok(rawTable[0][0] == 'Field Name','This doesnt appear to be a table from a cucumber step. First row should be | Field Name           | Field Level Security |');
    assert.ok(rawTable[0][1] == 'Field Level Security','This doesnt appear to be a table from a cucumber step. First row should be | Field Name           | Field Level Security |');
    var expectedFLS = _.chain(rawTable)
                        .slice(1)
                        .flatten()
                        .chunk(2)
                        .value();
    logger(`theProfilesFLSIs() - actualFLS: ${JSON.stringify(actualFLS)}`, true);
    logger(`theProfilesFLSIs() - expectedFLS: ${JSON.stringify(expectedFLS)}`, true);
    
    // // get object fls immutably
    var actualFields = _.map(actualFLS[object],(flsRow) => flsRow.slice(0));
    const actualReadOnly = getFLSColumn(actualFields,'Read Only');
    const actualFullAccess = getFLSColumn(actualFields,'Full Access');
    const actualNoAccess = getFLSColumn(actualFields,'No Access');
    var actualAccessGroups = {"Read Only":actualReadOnly, "Full Access":actualFullAccess, "No Access":actualNoAccess};
    var expectedAccessGroups = _.groupBy(expectedFLS,_.last);
    
    var pass = true;
    var testResult = `\n--------------------------------\n`;
    testResult = `\n\tFLS for "${profile}" profile, "${object}" object\n--------------------------------\n`;
    logger(`expected accessGroups: ${JSON.stringify(expectedAccessGroups)}`, true);
    for(const access of Object.keys(expectedAccessGroups)) {
        assert.ok(Object.hasOwn(actualAccessGroups,access),`"${access}" is not a valid access value for Field Level Security.`);
        for(const [field,fls] of expectedAccessGroups[access]) {
            // [["Read Only", [field,field1,fieldn]], ["Full Access", [field,field1,fieldn]] ] etc.
            var others = _.pairs(_.omit(actualAccessGroups,fls));
            if(_.contains(actualAccessGroups[fls],field)) {
                testResult += ` * ${field} = "${access}",\n`;
            } else {
                pass = false;
                const other = _.contains(others[0][1],field) ? others[0][0] : _.contains(others[1][1],field) ? others[1][0] : 'FIELD DOES NOT EXIST';
                testResult += ` X ${field} != "${access}",\n`;
                testResult += `\t\t${field} = "${other}"\n`;
            }
        }
    }
    testResult += `---------------------\n`;
    logger(`theProfileHasTheFLS() result: ${testResult}`, true);
    console.log(testResult)
    if(!pass) throw new Error(testResult);
    return pass;
}
