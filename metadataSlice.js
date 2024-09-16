import { createSlice } from '@reduxjs/toolkit';
import assert from 'node:assert/strict';
import _ from 'underscore';

var metadataSlice = createSlice({
    name: 'metadata',
    initialState: {
    },
    reducers: {
        storeMetadata(state,action) {
            var message = action.payload;
            console.log(`it works: ${message}`)
        },
    }
});

export const { test } = metadataSlice.actions;
export default metadataSlice.reducer;