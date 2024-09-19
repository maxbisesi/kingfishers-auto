import ReduxStore from './ReduxStore.js';
import { jest } from '@jest/globals';
import { listMetadata,connectAsUsers,addConnection } from './api.js';
import assert from 'node:assert/strict';
import _ from 'underscore';
import CustomObjectProfileList from './mocks/CustomObjectProfileList.js';
// export function addConnection(userName,{rest,soap,restRoot}) {
//     //logger(`${userName}.restRoot: ${restRoot}`);
//     connections[userName] = {rest,soap,restRoot};
// }

test('ReduxStore to be an async function', () => {
  expect(typeof ReduxStore).toBe('function');
});

test('mock return', async () => {
    function getFullNameList(mdt) {
        return _.map(CustomObjectProfileList[mdt],(ob) => _.get(ob,'fullName'));
    }

    addConnection(`Admin`,getMockAdminConnection([CustomObjectProfileList]));
    var store = await ReduxStore([`Profile`,`CustomObject`]);

    var expctedPros = getFullNameList(`Profile`);
    var profiles = store.getList(`Profile`);
    expect(profiles.every((el,ind,arr) => expctedPros.includes(el))).toBeTruthy();
    var obs = store.getList(`CustomObject`);
    var expctedObs = getFullNameList(`CustomObject`);
    expect(obs.every((el,ind,arr) => expctedObs.includes(el))).toBeTruthy();


});

function getMockAdminConnection(mocks) {
    var isDefined = _.negate(_.isUndefined);
    assert.ok(Array.isArray(mocks));
    assert.ok(_.size(mocks) == 1);
    assert.ok(_.every(mocks,isDefined));
    // mocks =[
    //    'returned By soap.metadata.list','',''
    //]
    return {
        rest: jest.fn(),
        soap: {
            metadata: {
                list: jest.fn((q,v) => mocks.at(0))
            }
        },
        restRoot: `none`
    }
}