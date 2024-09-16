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
import { configureStore } from '@reduxjs/toolkit';
// use for cucumber
import { createSlice } from '@reduxjs/toolkit';
import metadataReducer from './metadataSlice.js'
import { logger } from './logger.js';

const reducerProxy = (state, action) => {
    if(action.type === 'logout/LOGOUT') {
      return metadataReducer(undefined, action);
    }
    return metadataReducer(state, action);
}
  
export default configureStore({
    reducer: reducerProxy,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),loggerMiddleWare]
});

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


