import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { connectAsUsers,createListMetadataQueries,getAdminConnection,listMetadata } from './api.js';
import _ from 'underscore';
import * as mdtSlice from './metadataSlice.js';
import store from './store.js';
import {writeLog} from './logger.js';

var connections = await connectAsUsers([`Admin`]);

var rl = readline.createInterface({ input, output });
var menu = [`SfAuto2 Smoke Test`,`Profiles`,`Option #3`,`Option #4`,`Option #5`,`Option #6`];
mainMenu();

rl.on('line', async (input) => {
    //console.log(`Received: ${input}\n`);
    if(menu.includes(input)) {
        handleMainMenu(input);
    }

}); 

function mainMenu() {
    for(let i = 0; i < 2; i++) {
        const start = i * 3;
        const end = start + 3;
        var row = menu.slice(start,end).join('\t* ');
        const line = `  * ${row}`;
        rl.write(`\n`);
        rl.write(`\t${line}\n`);
        rl.write(`\n`);
    }
    rl.write(`\t------------------------------\n`);
}

function handleMainMenu(input) {
    if(input == 'Profiles') {
        writeList()
    }

    if(allProfiles.includes(input)) {
        rl.write(`\t\tPermission Sets`);
        
        var ps = await rl.question(`\tPermission Set?: `);
        console.log(typeof ps);
        if(allPermissonSets.includes(ps)) {
            // do nothing for now
        }
        allObjects

    }
}

async function metadata() {
    store.getState();
    var allProfiles = listedMetadata[`Profile`].map((el,ind,arr) => el.fullName);
    var allPermissionSets = listedMetadata[`PermissionSet`].map((el,ind,arr) => el.fullName);
    var allObjects = listedMetadata[`CustomObject`].map((el,ind,arr) => el.fullName);
    var metadatatypes = [`Profile`,`PermissionSet`,`CustomObject`];

    return {
        async list(metdataType) {
            if(!metadatatypes.includes(metdataType)) {
                let listedMetadata = await listMetadata([metdataType]);
                let allComponents = listedMetadata[mdt].map((el,ind,arr) => el.fullName);
                store.dispatch(mdtSlice.storeMetadata({metdataType,allComponents}));
            }
        }
    }

    function writeList(lst) {
        lst.forEach((el,ind,arr) => rl.write(`  - ${el}\n`));
    }
}