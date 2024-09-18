import ReduxStore from './ReduxStore.js';
import { listMetadata,connectAsUsers } from './api.js';
import CustomObjectProfileList from './mocks/CustomObjectProfileList.js';

test('ReduxStore to be an async function', () => {
  expect(typeof ReduxStore).toBe('function');
});

test('mock return', async () => {
    listMetadata.mockReturnValue(CustomObjectProfileList);
    var restore = await ReduxStore([`Profile`,`CustomObject`]);
});