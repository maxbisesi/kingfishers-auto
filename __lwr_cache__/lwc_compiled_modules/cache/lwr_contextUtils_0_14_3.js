// Wire adapters follow LWC types, which come from a non-portable module
// eslint-disable-next-line lwr/only-allowed-type-imports

import { ContextInfo } from './contextInfo.js';
export { ContextInfo };
export { getNavigationHelm, registerNavigationHelm } from './navigationApiStore.js';

/**
 * Interface for contextual wire adapters to subscribe to context changes
 */

export function generateContextualWireAdapter(contextInstance) {
  var _Adapter;
  const Adapter = (_Adapter = class Adapter {
    constructor(callback) {
      this._callback = callback;
    }
    connect() {
      // There is no 'connect' because context is provided via the update API.
    }
    disconnect() {
      // no-op
    }
    // The default update method services wires that emit context as TEmit when their value changes.
    // Wires that need more complex logic or use another emit type should override this method.
    update(config, context) {
      if (context) {
        this._callback(context);
      }
    }

    /**
     * Set the context value directly associated with the target as a context provider.
     *
     * @param {EventTarget} targetProvider
     * @param {ContextId} contextValue
     */
    static setContext(targetProvider, contextValue) {
      contextInstance.setContext(targetProvider, contextValue);
    }

    /**
     * Get the context value directly associated with the target as a context provider.
     *
     * @param {EventTarget} targetProvider
     */
    static getContext(targetProvider) {
      return contextInstance.getContext(targetProvider);
    }

    /**
     * Clear the context value and registered subscribers directly associated with the
     * target as a context provider.
     *
     * @param {EventTarget} targetProvider
     */
    static clearContext(targetProvider) {
      contextInstance.clearContext(targetProvider);
    }

    /**
     * Subscribe a consumer to the context value directly associated with the target as
     * a context provider. Calls to #set(targetProvider, contextValue) with the same
     * target will invoke the consumer.provide(contextValue) function.
     *
     * NOTE: Mutations to the contextValue directly do not result in calls to
     * consumer.provide(contextValue).
     *
     * @param {EventTarget} targetProvider
     * @param {ContextConsumer} consumer object with a provide(context) function property.
     */
    static subscribeContext(targetProvider, consumer) {
      contextInstance.subscribeContext(targetProvider, consumer);
    }

    /**
     * Unsubscribe a previously subscribed consumer from listening to changes on the
     * target
     * @param {EventTarget} targetProvider
     * @param {ContextConsumer} consumer
     */
    static unsubscribeContext(targetProvider, consumer) {
      contextInstance.unsubscribeContext(targetProvider, consumer);
    }
  }, _Adapter.contextSchema = {
    value: 'required'
  }, _Adapter);
  return Adapter;
}

// Prior to LWC version 4.0.0, the types `WireContextProvider` and `WireContextConsumer` were not generic.
// Adding the ts-ignore in case this code is compiled with a version of LWC that is older than 4.0.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore