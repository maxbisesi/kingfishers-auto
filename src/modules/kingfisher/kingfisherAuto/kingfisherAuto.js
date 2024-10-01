import { LightningElement } from "lwc";

export default class KingfisherAuto extends LightningElement {

    connectedCallback() {
        console.log(`KingfisherAuto connectedCallback()`);
    }

    profile;

    get profileOptions() {
        var profiles = [`Admin`,`ChatterFree`,`Silver Partner`];
        return profiles.map((el,ind,arr) => ({label:el,value:el}));
    }

    handleComboChange(e) {
        var {target,detail} = e;
    }

    handleClick(){
        console.log('click');
    }

}