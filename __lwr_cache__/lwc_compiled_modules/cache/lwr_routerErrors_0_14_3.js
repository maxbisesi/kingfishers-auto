/** @hidden */
/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const ERROR_CODE_PREFIX = 'LWR';
const DiagnosticLevel = {
  Fatal: 0,
  Error: 1,
  Warning: 2,
  Log: 3
};
function replaceArgs(message, args) {
  return Array.isArray(args) ? message.replace(/\{([0-9]+)\}/g, (_, index) => {
    return args[index];
  }) : message;
}
export function generateMessage(info, args) {
  return `${info.code}: ${replaceArgs(info.message, args)}`;
}
export function generateMessageObject(info, args) {
  const messageObject = {
    ...info,
    message: replaceArgs(info.message, args)
  };
  if (info.address) {
    messageObject.address = replaceArgs(info.address, args);
  }
  if (info.stack) {
    messageObject.stack = replaceArgs(info.stack, args);
  }
  return messageObject;
}
export function invariant(condition, errorInfo, args) {
  if (!condition) {
    throw new Error(generateMessage(errorInfo, args));
  }
}
export const messages = {
  INVALID_MIXIN_CMP: {
    code: `${ERROR_CODE_PREFIX}4001`,
    message: '{0} must be an Element type',
    level: DiagnosticLevel.Error
  },
  MISSING_CONTEXT: {
    code: `${ERROR_CODE_PREFIX}4002`,
    message: 'Could not find context to perform navigation action.',
    level: DiagnosticLevel.Error
  },
  INVALID_CONTEXT: {
    code: `${ERROR_CODE_PREFIX}4003`,
    message: 'Cannot register navigation context; it must have this shape: { navigate, generateUrl, subscribe }',
    level: DiagnosticLevel.Error
  },
  MULTIPLE_ROOTS: {
    code: `${ERROR_CODE_PREFIX}4004`,
    message: 'Router connection failed. There can only be one root router.',
    level: DiagnosticLevel.Error
  },
  MULTIPLE_CHILDREN: {
    code: `${ERROR_CODE_PREFIX}4005`,
    message: 'Could not add to the navigation hierarchy. There can only be one child per navigation node.',
    level: DiagnosticLevel.Error
  },
  MISSING_ROUTE: {
    code: `${ERROR_CODE_PREFIX}4006`,
    message: 'A route cannot be created to navigate to URL "{0}"',
    level: DiagnosticLevel.Error,
    address: '{0}'
  },
  MISSING_URL: {
    code: `${ERROR_CODE_PREFIX}4007`,
    message: 'A URL cannot be created to navigate to route "{0}"',
    level: DiagnosticLevel.Error,
    address: '{0}'
  },
  PRENAV_FAILED: {
    code: `${ERROR_CODE_PREFIX}4008`,
    message: 'A preNavigate hook listener blocked routing to "{0}"',
    level: DiagnosticLevel.Warning,
    address: '{0}'
  },
  MISSING_ROUTE_TEMPLATE: {
    code: `${ERROR_CODE_PREFIX}4009`,
    message: 'A route definition must contain a "uri" property.',
    level: DiagnosticLevel.Error
  },
  MISSING_ROUTE_CMP: {
    code: `${ERROR_CODE_PREFIX}4016`,
    message: 'Expected a route view component with a default export.',
    level: DiagnosticLevel.Error
  },
  MISSING_DATA_CONTEXT: {
    code: `${ERROR_CODE_PREFIX}4018`,
    message: 'Could not find context to retrieve navigation data.',
    level: DiagnosticLevel.Error
  },
  INVALID_ROUTE_QUERY: {
    code: `${ERROR_CODE_PREFIX}4019`,
    message: 'Invalid query param in route definition.',
    level: DiagnosticLevel.Error
  },
  MISSING_PAGE_BINDING: {
    code: `${ERROR_CODE_PREFIX}4020`,
    message: 'Route definition must provide page binding',
    level: DiagnosticLevel.Error
  },
  INVALID_PAGE_BINDING: {
    code: `${ERROR_CODE_PREFIX}4021`,
    message: 'Invalid page binding in route definition',
    level: DiagnosticLevel.Error
  },
  INVALID_URI_SYNTAX: {
    code: `${ERROR_CODE_PREFIX}4022`,
    message: 'Invalid uri syntax. URI cannot contain *, +, (, ), ',
    level: DiagnosticLevel.Error
  },
  VIEW_IMPORT_FAILED: {
    code: `${ERROR_CODE_PREFIX}4023`,
    message: 'Error importing view with name "{0}", failure was: {1}',
    level: DiagnosticLevel.Error,
    stack: '{2}'
  },
  VIEW_MISSING: {
    code: `${ERROR_CODE_PREFIX}4024`,
    message: 'Expected a view with name "{0}" in the viewset',
    level: DiagnosticLevel.Error
  },
  VIEW_IMPORT_FAILED_WITH_SPECIFIER: {
    code: `${ERROR_CODE_PREFIX}4025`,
    message: 'Error importing module "{0}" from view with name "{1}", failure was: {2}',
    level: DiagnosticLevel.Error,
    stack: '{3}'
  },
  NO_ROUTE_MATCH: {
    code: `${ERROR_CODE_PREFIX}4026`,
    message: 'A routing match cannot be found for: {0}',
    level: DiagnosticLevel.Error
  },
  INVALID_ROUTE_HANDLER: {
    code: `${ERROR_CODE_PREFIX}4027`,
    message: 'Route definition "{0}" does not have a valid route handler module',
    level: DiagnosticLevel.Error
  },
  DESTINATION_NOT_FOUND: {
    code: `${ERROR_CODE_PREFIX}4028`,
    message: 'Route handler returned 404: Not Found',
    level: DiagnosticLevel.Error
  },
  DESTINATION_ERROR: {
    code: `${ERROR_CODE_PREFIX}4029`,
    message: 'Route handler returned error status {0}: {1}',
    level: DiagnosticLevel.Error,
    stack: '{2}'
  },
  NO_INIT_URL: {
    code: `${ERROR_CODE_PREFIX}4030`,
    message: 'Cannot initialize a server router without a "url"',
    level: DiagnosticLevel.Error
  }
};