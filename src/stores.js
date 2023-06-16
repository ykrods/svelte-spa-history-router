import { writable, derived } from "svelte/store";

/**
 * @typedef { import("./types.ts").Route } Route
 * @typedef { import("./route_state.js").RouteState } RouteState
 */

/**
 * @template T
 * @typedef { import("svelte/store").Writable<T> } Writable
 */

/**
 * Store to detect changes (internal use).
 * @type { Writable<String> }
 */
export const currentPath = writable(window.location.pathname);

/**
 * Store to keep active route, params and props
 * @type { Writable<RouteState | null> }
 */
export const routeState = writable(null);

// Store of path variables (a bit convinient for getting $currentRoute.params).
export const routeParams = derived(routeState, ($routeState) => {
  return $routeState ? $routeState.params || {} : {};
});

// Store of current location (to detect changes of query or hash)
export const currentURL = (() => {
  function getCurrent() {
    return new URL(window.location.href);
  }
  const { subscribe, set } = writable(getCurrent());

  return {
    subscribe,
    /**
     * @param {URL} url
     */
    set(url) {
      set(url);
    },
    setCurrent() {
      set(getCurrent());
    },
  };
})();
