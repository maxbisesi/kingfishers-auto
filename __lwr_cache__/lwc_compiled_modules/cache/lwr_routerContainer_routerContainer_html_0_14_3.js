import _implicitStylesheets from "./routerContainer.css";
import _implicitScopedStylesheets from "./routerContainer.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<span class="router-title${0}" aria-live="polite" aria-atomic="true"${2}></span>`;
const stc0 = {
  key: 0
};
const stc1 = [];
function tmpl($api, $cmp, $slotset, $ctx) {
  const {s: api_slot, st: api_static_fragment} = $api;
  return [api_slot("", stc0, stc1, $slotset), api_static_fragment($fragment1, 2)];
  /*LWC compiler v8.1.2*/
}
export default registerTemplate(tmpl);
tmpl.slots = [""];
tmpl.renderMode = "light";
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-7bis3qj4jjc";
tmpl.legacyStylesheetToken = "lwr-routerContainer_routerContainer";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
