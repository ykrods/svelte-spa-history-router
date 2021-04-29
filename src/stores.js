import { writable, derived } from "svelte/store";

// Store to detect changes (internal use).
export const currentPath = writable(window.location.pathname);

// Store to get current params or component.
export const currentRoute = writable(null);

// Store of path variables (a bit convinient for getting $currentRoute.params).
export const routeParams = derived(currentRoute, ($currentRoute) => {
  return $currentRoute ? $currentRoute.params || {} : {};
});
