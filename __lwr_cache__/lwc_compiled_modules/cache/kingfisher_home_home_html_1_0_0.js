import _implicitStylesheets from "./home.css";
import _implicitScopedStylesheets from "./home.scoped.css?scoped=true";
import _lwrOutlet from "lwr/outlet";
import _lwrRouterContainer from "lwr/routerContainer";
import {freezeTemplate, registerTemplate} from "lwc";
const stc0 = {
  styleDecls: [["border", "1px black", false]],
  key: 1
};
const stc1 = {
  key: 2
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {c: api_custom_element, h: api_element} = $api;
  return [api_custom_element("lwr-router-container", _lwrRouterContainer, {
    props: {
      "router": $cmp.router
    },
    key: 0
  }, [api_element("div", stc0, [api_custom_element("lwr-outlet", _lwrOutlet, stc1)])])];
  /*LWC compiler v8.1.2*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-6k2j0fgc44e";
tmpl.legacyStylesheetToken = "kingfisher-home_home";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
