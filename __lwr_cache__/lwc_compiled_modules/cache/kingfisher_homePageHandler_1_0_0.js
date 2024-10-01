import _tmpl from "./homePageHandler.html";
import { registerComponent as _registerComponent } from "lwc";
class HomePageHandler {
  constructor(callback) {
    this.callback = void 0;
    this.callback = callback;
  }
  dispose() {
    /* noop */
  }
  update() {
    this.callback({
      viewset: {
        default: () => import('kingfisher/kingfisherAuto')
      }
    });
  }
}
const __lwc_component_class_internal = _registerComponent(HomePageHandler, {
  tmpl: _tmpl,
  sel: "kingfisher-home-page-handler",
  apiVersion: 63
});
export default __lwc_component_class_internal;