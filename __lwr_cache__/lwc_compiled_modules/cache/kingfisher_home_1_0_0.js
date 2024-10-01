import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./home.html";
import { createRouter } from 'lwr/router';

// Route definition array
var routes = [{
  id: 'home',
  uri: '/',
  handler: () => import('kingfisher/homePageHandler'),
  page: {
    type: 'home'
  }
}];
class Home extends LightningElement {
  constructor(...args) {
    super(...args);
    this.router = createRouter({
      routes
    });
  }
  /*LWC compiler v8.1.2*/
}
_registerDecorators(Home, {
  fields: ["router"]
});
const __lwc_component_class_internal = _registerComponent(Home, {
  tmpl: _tmpl,
  sel: "kingfisher-home",
  apiVersion: 63
});
export default __lwc_component_class_internal;