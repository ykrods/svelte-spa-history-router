import { push } from "./push.js";

/**
 * @param {HTMLElement} node
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
