import { push } from "./push";

export function link(node) {
  function onClick(event) {
    event.preventDefault();
    push(node.getAttribute("href"));
  }

  node.addEventListener("click", onClick);

  return {
    destroy() {
      node.removeEventListener("click", onClick);
    },
  };
}
