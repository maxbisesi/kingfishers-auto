import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./outlet.html";
import { CurrentView } from 'lwr/navigation';
class Outlet extends LightningElement {
  constructor(...args) {
    super(...args);
    this.refocusOff = false;
    this.outletErrorCallback = void 0;
    this.viewName = 'default';
    this.viewCtor = undefined;
    this.previousViewCtor = undefined;
    this.hasError = false;
  }
  // Get a reference to the current view
  setView(currentView) {
    this.hasError = false;
    this.viewCtor = currentView;
    this.refocus();
  }
  renderedCallback() {
    if (this.viewCtor !== this.previousViewCtor) {
      this.previousViewCtor = this.viewCtor;
      const viewChangedEvent = new CustomEvent('viewchange', {
        detail: this.viewCtor
      });
      this.dispatchEvent(viewChangedEvent);
    }
  }
  errorCallback(e, stack) {
    // when hosted view has unhandled error thrown:
    //  - display the error slot
    //  - dispatch the "viewchange" event
    //  - call the outletErrorCallback()
    this.hasError = true;
    const viewErrorEvent = new CustomEvent('viewerror', {
      detail: {
        error: e,
        stack
      }
    });
    this.dispatchEvent(viewErrorEvent);
    if (this.outletErrorCallback) {
      this.outletErrorCallback(e, stack);
    } else {
      console.error(e);
    }
  }
  refocus() {
    // If the feature is not turned off, put the browser focus onto the dynamic content.
    // This is done after a route change for accessibility.
    if (!this.refocusOff) {
      const region = this.querySelector(`div[role='region'].outlet`);
      if (region) region.focus();
    }
  }
  /*LWC compiler v8.1.2*/
}
Outlet.renderMode = 'light';
_registerDecorators(Outlet, {
  publicProps: {
    refocusOff: {
      config: 0
    },
    outletErrorCallback: {
      config: 0
    },
    viewName: {
      config: 0
    }
  },
  wire: {
    setView: {
      adapter: CurrentView,
      dynamic: ["viewName"],
      method: 1,
      config: function ($cmp) {
        return {
          viewName: $cmp.viewName
        };
      }
    }
  },
  fields: ["viewCtor", "previousViewCtor", "hasError"]
});
const __lwc_component_class_internal = _registerComponent(Outlet, {
  tmpl: _tmpl,
  sel: "lwr-outlet",
  apiVersion: 63
});
export default __lwc_component_class_internal;