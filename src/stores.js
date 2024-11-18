import { writable, derived } from "svelte/store";

/**
 * @template T
 * @typedef { import("svelte/store").Writable<T> } Writable
 */

/**
 * @template T
 * @typedef { import("svelte/store").Readable<T> } Readable
 */

/**
 * @typedef { import("./types.ts").Route } Route
 * @typedef { import("./types.ts").RouteParams } RouteParams
 * @typedef { import("./types.ts").CurrentURL } CurrentURL
 * @typedef { import("./types.ts").RouteState } RouteState
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

/**
 * Store of captured variables in path
 *
 * scheduled to be deprecated after svelte5 released
 *
 * @type Readable<RouteParams>
 */
export const routeParams = derived(routeState, ($routeState) => {
  return ($routeState && $routeState.params) ?? {};
});

/**
 * Store of current location (to detect changes of query or hash)
 *
 * @type CurrentURL
 */
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
