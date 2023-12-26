export { default as Router } from "./Router.svelte";
export { routeParams, currentURL } from "./stores.js";
export { link } from "./link.js";
export { push } from "./push.js";

/**
 * @typedef { import("./types").Redirection } Redirection
 */

/**
 * This is special function used in resolvers.
 * Normally, you use `push()` to change the url.
 *
 * @param {string} to
 * @return {Redirection}
 */
export function redirect(to) {
  return { redirect: to };
}
