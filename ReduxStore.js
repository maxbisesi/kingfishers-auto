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
import { listMetadata,connectAsUsers } from './api.js';
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
        lists: [
            [
                'Profile',
                [
                  'B2B Reordering Portal Buyer Profile',
                  'Standard'
                ]
            ],
        ]
    },
    reducers: {
        storeMetadataLists(state,action) {
            var { metadata } = action.payload;
            state[`lists`] = metadata;
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


async function getMetadataList(mdtTypes = [`Profile`]) {
    assert.ok(Array.isArray(mdtTypes));
    await connectAsUsers([`Admin`]);
    var listedMetadata = await listMetadata(mdtTypes);
    var metadata = [];
    _.each(listedMetadata,(value, key, list) => {
        let fullnames = _.map(value,(el,ind,arr) => el.fullName);
        metadata.push([key,fullnames]);
    });
    return metadata;
}

async function ReduxStore(mdtTypes) {
    // If it can take more than one argument it's an array
    // If it can only take one it's a string.
    assert.ok(Array.isArray(mdtTypes));

    // Lists 
    var metadata = await getMetadataList(mdtTypes);
    store.dispatch(storeMetadataLists({metadata}));

    function getStateProp(prp) {
        return _.get(store.getState(),prp);
    }

    function getList(mdttype) {
        //assert.ok(mdtTypes.includes(mdttype),``)
        const lists = getStateProp(`lists`);
        const typelist = lists.find((el,ind,arr) => _.first(el) == mdttype);
        if(typelist === undefined) return [];
        return _.last(typelist);
    }

    var api = Object.create(null);
    Object.defineProperty(api,'getList',{
        value: getList,
        writable: false,
        configurable: false,
        enumerable: true
    });

    return api;
}


export default ReduxStore;

