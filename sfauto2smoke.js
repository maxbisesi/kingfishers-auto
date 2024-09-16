import { connectAsUsers } from './api.js';
import min from 'minimist';
// import {getMultipleDescribeMetadatas,viewPageLayoutForObjectsRecTypes} from './steps/stepFunctions.js';
import {getMultipleDescribeMetadatas} from './api.js';

var argv = min(process.argv.slice(2))
console.log(argv);


var rawTable = ['Admin'];
await connectAsUsers(rawTable);
var objectList;
var profile;
var recordTypes = [];

assert.ok(Array.isArray(objectList),`objectList must be a Cucumber rawTable: [['objectname']]`);
assert.ok(Array.isArray(objectList[0]),`objectList must be a Cucumber rawTable: [['objectname']]`);
assert.ok(_.size(objectList) == 1,`objectList must use only one object at a time, not: ${_.size(objectList)}`);
await getMultipleDescribeMetadatas(objectList);

// New variable holding Object name of this test 
var [sobjectName] = _.flatten(objectList);

// rlr = [
//     ['Account','Field_Sales_Account'],
//     ['Contact','ContactRecordTypename']
// ]
const rlr = selectors.selectRegressionLayoutRows(store.getState());
assert.ok(Array.isArray(rlr),`Regression Layout Rows isn't an array it should be like: [['object','rectypename'],['object2','rectypename']]`);
await viewPageLayoutForObjectsRecTypes(rlr);

await _viewPageLayoutNamesForPageLayout(rlr);
var usernames = _.keys(connectionManager.getConnections());

for(const un of usernames) {
    var objectRectypeLayouts = getRecTypeLayoutsByUsername(un);
    // Only creating tests for the given Record Types
    if(_.size(recordTypes) > 0) objectRectypeLayouts = _.pick(objectRectypeLayouts[sobjectName],recordTypes);
    //console.log(objectRectypeLayouts);

    // implement as many RecordType layout handler functions as you need.
    // Just surround with {} to prenvent name colissions
    {
        const {lines,locators} = defaultHandleRecordTypeLayouts(un,sobjectName,objectRectypeLayouts);
        if(_.size(lines) > 0) {
            fs.writeFile(`./features/${profile}_${sobjectName}SmokeTest.feature`,lines);
        } else {
            assert.fail(`No lines written for ${un} ${sobjectName}`);
        }

        if(_.size(locators) > 0) {
            fs.writeFile(`./features/testLocators.js`,locators);
        }
    }
}


