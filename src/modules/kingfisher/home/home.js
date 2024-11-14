import { LightningElement } from "lwc";
import { createRouter } from 'lwr/router';

// Route definition array
var routes = [
  {
    id: 'home',
    uri: '/',
    handler: () => import('kingfisher/homePageHandler'),
    page: {
      type: 'home',
    }
  }
];


export default class Home extends LightningElement {
  router = createRouter({ routes });
}