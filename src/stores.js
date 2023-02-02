import { writable, derived } from "svelte/store";

// Store to detect changes (internal use).
export const currentPath = writable(window.location.pathname);

// Store to get current params or component.
export const currentRoute = writable(null);

// Store of path variables (a bit convinient for getting $currentRoute.params).
export const routeParams = derived(currentRoute, ($currentRoute) => {
  return $currentRoute ? $currentRoute.params || {} : {};
});

// Store of current location (to detect changes of query or hash)
export const currentURL = (() => {
  function getCurrent() {
    return new URL(window.location);
  }
  const { subscribe, set } = writable(getCurrent());

  return {
    subscribe,
    set(url) {
      set(url);
    },
    setCurrent() {
      set(getCurrent());
    },
  };
})();
