import { createSlice,createSelector } from '@reduxjs/toolkit';
import assert from 'node:assert/strict';
import _ from 'underscore';

var metadataSlice = createSlice({
    name: 'metadata',
    initialState: {
    },
    reducers: {
        storeMetadata(state,action) {
            var {} = action.payload;
            
        },
    }
});

var getAllMetadataTypes = createSelector(
    [
        state => state.usernameObjectLookup,
        (state,username) => username
    ],
    (usernameObjectLookup,username) => {
        var unobject = (test) => _.isEqual(_.first(test),username);
        return _.pick(usernameObjectLookup,unobject)
    }
);

export const { test } = metadataSlice.actions;
export default metadataSlice.reducer;