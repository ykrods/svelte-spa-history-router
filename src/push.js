import { currentPath, currentURL } from "./stores.js";

/**
 * @param {string} next
 */
export function push(next) {
  window.history.pushState({}, "", next);

  // Exclude queryString and hash
  const url = new URL(next, window.location.origin);
  currentPath.set(url.pathname);
  currentURL.set(url);
}
