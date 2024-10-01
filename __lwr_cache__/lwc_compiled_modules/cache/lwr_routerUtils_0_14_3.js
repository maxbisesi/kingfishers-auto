/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export { createFilterChain } from './filterUtils.js';
export { getPageReferenceFromUriAndRouteDef } from './routeDefUtils.js';
export { DEFAULT_I18N_ROUTER_CONFIG, getUrlFromPageReference, getPageReferenceFromUrl, matchRouteByUrl, getUrlFromPageReferenceAndRouteDef } from './routeUtils.js';
export { isObject, freeze, guid, isValidRoute } from './typeUtils.js';
export { parseRoutes } from './parseUtils.js';
import { pathToRegexp as ptr, compile as ptrCompile } from './pathToRegexp.js';
export const pathToRegexp = {
  pathToRegexp: ptr,
  compile: ptrCompile
};
export { getPathFromUrl, getQueryFromUrl, getQueryString, encode, decode } from './uriUtils.js';
export { hasDocument } from './domUtils.js';