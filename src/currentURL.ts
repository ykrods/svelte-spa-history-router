// https://svelte.dev/docs/svelte/compiler-warnings#state_referenced_locally
// https://svelte.dev/docs/svelte/$state#Passing-state-into-functions

import { getSpaContext } from "./spa-context"


export function currentURL(): URL {
  return getSpaContext().currentURL();
}
