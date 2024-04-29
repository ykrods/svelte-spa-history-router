import { push } from "./push.js";

/**
 * Svelte action to make `<a>` work as navigation of svelte-spa-history-router
 *
 * @param {HTMLElement} node - target `<a>`
 *
 * @example
 *
 *   <a use:link href="/">top</a>
 */
export function link(node) {
  /**
   * @param {Event} event
   */
  function onClick(event) {
    event.preventDefault();
    const href = node.getAttribute("href");
    if (href) {
      push(href);
    }
  }

  node.addEventListener("click", onClick);

  return {
    destroy() {
      node.removeEventListener("click", onClick);
    },
  };
}
