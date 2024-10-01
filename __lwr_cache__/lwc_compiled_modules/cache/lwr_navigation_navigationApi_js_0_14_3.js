import { getNavigationHelm } from 'lwr/contextUtils';
/**
 * Navigate programmatically to a page reference.
 * The Promise used within is deliberately not returned.
 *
 * @param {HTMLElement} context - The navigation context
 * @param {PageReference} pageReference - A page reference location
 * @param {boolean} replace - When true the previous browser history entry should be replaced by this one
 * @param {NavigateOptions} options - Additional navigation options (i.e. switch locale)
 */
export function navigate(context, pageReference, replace, options) {
  const api = getNavigationHelm(context);
  api.navigate(pageReference, replace, options);
}

/**
 * Generate a URL for the given page reference.
 *
 * @param {HTMLElement} context - The navigation context
 * @param {PageReference} pageReference - A page reference location
 *
 * @returns {Promise<string>}
 */
export function generateUrl(context, pageReference, options) {
  const api = getNavigationHelm(context);
  return api.generateUrl(pageReference, options);
}