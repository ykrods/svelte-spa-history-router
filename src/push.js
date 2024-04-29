import { currentPath, currentURL } from "./stores.js";

/**
 * Navigate to next page programmatically
 *
 * @param {string} next
 *
 * @example
 *
 *   <button on:click={ () => push(`posts/${id}`) }>next</button>
 */
export function push(next) {
  window.history.pushState({}, "", next);

  // Exclude queryString and hash
  const url = new URL(next, window.location.origin);
  currentPath.set(url.pathname);
  currentURL.set(url);
}
