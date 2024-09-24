import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import _ from 'underscore';
import ReduxStore from './ReduxStore.js';
import {writeLog} from './logger.js';
import {listMetadataSOAP,addAdminConnection, getAdminConnection} from './api.js';
import fs from 'fs/promises';
import assert from 'node:assert/strict';
var allSupportedMdt = [
    `PermissionSet`,`CustomObject`,`Profile`,`ApexClass`,`LightningComponentBundle`,
    `ApexTrigger`,`CustomApplication`,`CustomLabel`,`CustomTab`,
    `Dashboard`,`EmailTemplate`,`FlexiPage`,`Flow`,`Group`,
    `HomePageLayout`,`Layout`,`PermissionSetGroup`,`Queue`,
    `QuickAction`,`Report`,`Role`,`RestrictionRule`,
    `SharingSet`,`Workflow`
];

await addAdminConnection();
for(const chunk of _.chunk(allSupportedMdt,3)) {
    let mdt = await listMetadataSOAP(chunk);
    const support = _.keys(mdt);
    assert.ok(_.every(support,(el,ind,arr) => allSupportedMdt.includes(el)));
}
