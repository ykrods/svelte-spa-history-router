import type { SpaContext } from "./types"

import { setContext, getContext } from "svelte";


const key = Symbol("svelte-spa-history-router");


export function setSpaContext(ctx: SpaContext) {
  setContext(key, ctx);
}

export function getSpaContext(): SpaContext {
  return getContext<SpaContext>(key);
}
