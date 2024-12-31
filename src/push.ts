import type { NavigationEvent } from "./types"

import * as SpaEvent from "./spa-event"

/**
 * Navigate to next page programmatically
 *
 * @example
 *
 *   <button on:click={ () => push(`posts/${id}`) }>next</button>
 */
export function push(next: string) {
  const evt: NavigationEvent = new CustomEvent(
    SpaEvent.NAVIGATE,
    { detail: { next } }
  )
  window.dispatchEvent(evt);
}
