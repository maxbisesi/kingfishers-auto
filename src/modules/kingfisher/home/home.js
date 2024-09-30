import { LightningElement } from "lwc";
import { createRouter } from "@lwrjs/router/kf-router-config";

export default class Home extends LightningElement {
  router = createRouter();
}