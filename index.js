import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { connectAsUsers,createListMetadataQueries,getAdminConnection,listMetadata } from './api.js';
import _ from 'underscore';
import * as mdtSlice from './metadataSlice.js';
import store from './store.js';
import {writeLog} from './logger.js';

var connections = await connectAsUsers([`Admin`]);
var listedMetadata = await listMetadata([`Profile`,`PermissionSet`,`CustomObject`]);

var allProfiles = listedMetadata[`Profile`].map((el,ind,arr) => el.fullName);
var rl = readline.createInterface({ input, output });

rl.write(`  Choose what you want to do`);
var menu = [`SfAuto2 Smoke Test`,``]
rl.write()
var answer = await rl.question(`Which Metadata? (Profiles,PermissionSets): `);

if(answer == `Profiles`) {
    let profs = allProfiles.reduce((question,curr,ind,arr) => {
        question += `   - ${curr}\n`;
        return question;
    },``);
    await rl.write(profs);
}
