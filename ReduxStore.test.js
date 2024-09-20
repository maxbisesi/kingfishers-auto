import ReduxStore from './ReduxStore.js';
import { jest } from '@jest/globals';
import { listMetadataSOAP, addMockAdminConnection } from './api.js';
import assert from 'node:assert/strict';
import _ from 'underscore';
import CustomObjectProfileList from './mocks/CustomObjectProfileList.js';

test('ReduxStore to be an async function', () => {
  expect(typeof ReduxStore).toBe('function');
});

test('ReduxStore.selectMetadataList()', async () => {

    var expectedprofiles =  [
        'Customer Community Plus User',
        'HighVolumePortal',
        'Customer Community User',
        'Identity User',
        'Minimum Access - API Only Integrations'
    ];
    var admin = getMockAdminConnection([CustomObjectProfileList]);
    addMockAdminConnection(admin);

    var store = await ReduxStore([`Profile`,`CustomObject`]);

    var profiles = store.selectMetadataList(`Profile`);
    var objects = store.selectMetadataList(`CustomObject`);
    expect(profiles[0]).toBe('Profile');
    expect(profiles[1]).toEqual(expect.arrayContaining(expectedprofiles));
    expect(objects[0]).toBe('CustomObject');
    expect(objects[1]).toEqual(expect.arrayContaining(['AppointmentScheduleLog']));
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
                list() {
                    return Promise.resolve(mocks[0]);
                }
            }
        },
        restRoot: `none`,
        isTest: true
    };
}