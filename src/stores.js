import { writable, derived } from "svelte/store";

// Store used by router to detect changes.
export const currentPath = writable(null);

// Store for component or application using router.
export const currentRoute = writable(null);

// Store of path variables (a bit convinient for getting $currentRoute.params).
export const routeParams = derived(currentRoute, ($currentRoute) => {
  return $currentRoute ? $currentRoute.params || {} : {};
});
