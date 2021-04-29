export { default as Router } from "./Router.svelte";
export { routeParams } from "./stores.js";
export { link } from "./link.js";
export { push } from "./push.js";

// This is special function used in resolvers.
// Normally, you use `push()` to change the url.
export function redirect(to) {
  return { redirect: to };
}
