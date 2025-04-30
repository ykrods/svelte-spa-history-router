import { push } from "./push";

/**
 * Svelte action to make `<a>` work as navigation of svelte-spa-history-router
 *
 * @param node - target `<a>`
 *
 * @example
 *
 *   <a use:link href="/">top</a>
 */
export function link(node: HTMLAnchorElement) {
  function onClick(event: Event) {
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
