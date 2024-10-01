import _implicitStylesheets from "./kingfisherAuto.css";
import _implicitScopedStylesheets from "./kingfisherAuto.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<article class="slds-card${0}"${2}><div class="slds-card__header slds-grid${0}"${2}><header class="slds-media slds-media_center slds-has-flexi-truncate${0}"${2}></header></div><div class="slds-card__body slds-card__body_inner slds-grid slds-gutters slds-wrap${0}"${2}><div class="slds-col${0}"${2}><input type="text"${3}></div><div class="slds-col${0}"${2}><input type="button"${3}></div><div class="slds-col${0}"${2}><p${3}>yay</p></div><div class="slds-col${0}"${2}><p${3}>4</p></div></div></article>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, sp: api_static_part, st: api_static_fragment} = $api;
  const {_m0, _m1} = $ctx;
  return [api_static_fragment($fragment1, 1, [api_static_part(5, {
    on: _m0 || ($ctx._m0 = {
      "change": api_bind($cmp.handleComboChange)
    })
  }, null), api_static_part(7, {
    on: _m1 || ($ctx._m1 = {
      "click": api_bind($cmp.handleClick)
    })
  }, null)])];
  /*LWC compiler v8.1.2*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-69qdcm2gbf0";
tmpl.legacyStylesheetToken = "kingfisher-kingfisherAuto_kingfisherAuto";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
