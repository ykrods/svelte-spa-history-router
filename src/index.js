export { default as Router } from "./Router.svelte";
export { routeParams } from "./stores";
export { link } from "./link";
export { push } from "./push";

// This is special function used in resolvers.
// Normally, you use `push()` to change the url.
export function redirect(to) {
  return { redirect: to };
}
