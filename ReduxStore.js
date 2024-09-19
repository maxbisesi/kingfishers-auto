/* eslint-disable no-case-declarations */
// Tips
// This helper is just a convenience! 
// You can write your own combineReducers that works differently, 
// or even assemble the state object from the child reducers manually and write a root reducing function explicitly, 
// like you would write any other function.
// You may call combineReducers at any level of the reducer hierarchy. 
// It doesn't have to happen at the top. 
// In fact you may use it again to split the child reducers that get too complicated into independent grandchildren, and so on.
// Important!!
// combineReducers() namespaces state to have slices named after their reducers, if you add more reducers and combine them, consider the effects that will have on selectors
// use for jest
import { configureStore,createSlice,createSelector } from '@reduxjs/toolkit';
import assert from 'node:assert/strict';
import { logger } from './logger.js';
import { listMetadataSOAP } from './api.js';
import _ from 'underscore';

var seperator = `--------------------------------------------------------------------------------------------------------------------------------------------\n`;
function loggerMiddleWare({ getState }) {
    var state;
    return next => action => {
        logger(`X=> ${action.type}`);
        logger(`payload: `);
        switch(action.type) {
            case 'metadata/test': 
                logger(`hello test`,false);
                break;
            default: 
                logger(`${JSON.stringify(action.payload)}\n`,false);
                logger(seperator,false);
        }
        return next(action);
    }
}

var metadataSlice = createSlice({
    name: 'metadata',
    initialState: {
        Lists: [
            [
                'Profile',
                [
                  'MOCK profile',
                  'SOMETHING IS BROKEN IF YOU SEE THIS '
                ]
            ],
        ]
    },
    reducers: {
        storeMetadataLists(state,action) {
            var metadataLists = action.payload;
            console.log(metadataLists);
            state[`Lists`] = metadataLists;
        },
    }
});

var { storeMetadataLists } = metadataSlice.actions;
var metadataReducer = metadataSlice.reducer;

var reducerProxy = (state, action) => {
    if(action.type === 'logout/LOGOUT') {
      return metadataReducer(undefined, action);
    }
    return metadataReducer(state, action);
}

var store = configureStore({
    reducer: reducerProxy,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),loggerMiddleWare]
});

function selectMetadataLists() {
    return _.get(store.getState(),`Lists`);
}

function selectMetadataList(mdttype) {
    assert.ok(typeof mdttype === 'string');
    const lists = selectMetadataLists();
    const typelist = lists.find( ([typename,list],ind,arr) => typename == mdttype );
    assert.ok(typelist !== undefined,`Metdata Type List not found for: ${mdttype}`);

    return typelist;
}

async function getMetadataLists(mdtTypeNames) {
    assert.ok(Array.isArray(mdtTypes));
    var listMetadataSOAPResult = await listMetadataSOAP(mdtTypes);
    var metadataTypeLists = [];
    _.each(mdtTypeNames,(typeName) => {
        const list = _.map(listMetadataSOAPResult[typeName],(obj) => obj.fullName);
        metadataTypeLists.push([typeName,list]);
    });
    // [['Profile',['Standard','System Administrator']],['CustomObject',['Account','Contact']]]
    assert.ok(metadataTypeLists.every((el,ind,arr) => mdtTypeNames.includes(el[0])));
    store.dispatch(storeMetadataLists(metadataTypeLists));
}

async function ReduxStore(mdtTypes) {
    // If it can take more than one argument it's an array
    // If it can only take one it's a string.
    // Call apis and store result in redux store in same function
    assert.ok(Array.isArray(mdtTypes));
    // Lists 
    await getMetadataLists(mdtTypes);

    // ReduxStore() returns selectors
    return { selectMetadataList,selectMetadataLists };
}


export default ReduxStore;

