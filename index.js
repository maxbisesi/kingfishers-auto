import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import _ from 'underscore';
import ReduxStore from './ReduxStore.js';
import {writeLog} from './logger.js';
import {listMetadata} from './api.js';
import fs from 'fs/promises';

var restore = await ReduxStore([`Profile`,`CustomObject`]);
console.log(restore.getList([`Profile`]));

var listedComponents = await listMetadata([`Profile`,`CustomObject`]);
console.log();
fs.writeFile('./listMetadata.json',JSON.stringify(listedComponents));

// var rl = readline.createInterface({ input, output });
// var menu = [`SfAuto2 Smoke Test`,`Profiles`,`Option #3`,`Option #4`,`Option #5`,`Option #6`];

// rl.on('line', async (input) => {
//     //console.log(`Received: ${input}\n`);
//     if(menu.includes(input)) {
//         //handleMainMenu(input);
//     }

// }); 

// function mainMenu() {
//     for(let i = 0; i < 2; i++) {
//         const start = i * 3;
//         const end = start + 3;
//         var row = menu.slice(start,end).join('\t* ');
//         const line = `  * ${row}`;
//         rl.write(`\n`);
//         rl.write(`\t${line}\n`);
//         rl.write(`\n`);
//     }
//     rl.write(`\t------------------------------\n`);
// }

// function handleMainMenu(input) {
//     if(input == 'Profiles') {
//         writeList()
//     }

//     if(allProfiles.includes(input)) {
//         rl.write(`\t\tPermission Sets`);
        
//         var ps = await rl.question(`\tPermission Set?: `);
//         console.log(typeof ps);
//         if(allPermissonSets.includes(ps)) {
//             // do nothing for now
//         }
//         allObjects

//     }
// }

