import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./kingfisherAuto.html";
class KingfisherAuto extends LightningElement {
  constructor(...args) {
    super(...args);
    this.profile = void 0;
  }
  connectedCallback() {
    console.log(`KingfisherAuto connectedCallback()`);
  }
  get profileOptions() {
    var profiles = [`Admin`, `ChatterFree`, `Silver Partner`];
    return profiles.map((el, ind, arr) => ({
      label: el,
      value: el
    }));
  }
  handleComboChange(e) {
    var {
      target,
      detail
    } = e;
  }
  handleClick() {
    console.log('click');
  }
  /*LWC compiler v8.1.2*/
}
_registerDecorators(KingfisherAuto, {
  fields: ["profile"]
});
const __lwc_component_class_internal = _registerComponent(KingfisherAuto, {
  tmpl: _tmpl,
  sel: "kingfisher-kingfisher-auto",
  apiVersion: 63
});
export default __lwc_component_class_internal;