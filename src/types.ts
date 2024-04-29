import type { ComponentType } from "svelte";
import type { Readable } from "svelte/store";

import type { RouteState } from "./route_state.js";
export type { RouteState } from "./route_state.js";

export type RouteParams = {
  [key: string]: string
}

export type RouteProps = {
  [key: string]: any
}

export type ComponentModule = {
  default: ComponentType,
}

export type Redirection = {
  redirect: string,
}

export interface CurrentURL extends Readable<URL> {
  set: (url: URL) => void
  setCurrent: () => void
}

type ResolverFunc = (routeState: RouteState) => PromiseLike<ComponentType | ComponentModule | Redirection> | ComponentType | Redirection

export type Route = {
  path: string,
  component?: ComponentType,
  resolver?: ResolverFunc,
}
