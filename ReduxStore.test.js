import ReduxStore from './ReduxStore.js';
import { jest } from '@jest/globals';
import { listMetadata, addMockAdminConnection } from './api.js';
import assert from 'node:assert/strict';
import _ from 'underscore';
import CustomObjectProfileList from './mocks/CustomObjectProfileList.js';

test('ReduxStore to be an async function', () => {
  expect(typeof ReduxStore).toBe('function');
});

test('mock return', async () => {
    function getFullNameList(mdt) {
        return _.map(CustomObjectProfileList[mdt],(ob) => _.get(ob,'fullName'));
    }

    var admin = getMockAdminConnection([CustomObjectProfileList]);
    addMockAdminConnection(admin);

    var store = await ReduxStore([`Profile`,`CustomObject`]);

    var expctedPros = getFullNameList(`Profile`);
    var profiles = store.getList(`Profile`);
    console.log(expctedPros);
    console.log(profiles);
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