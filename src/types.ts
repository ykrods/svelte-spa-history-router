import type { ComponentType } from "svelte";
import type { Readable } from "svelte/store";


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

export type RouteState = {
  component: ComponentType,
  params: RouteParams,
  props: RouteProps,
}

export type ResolverArgs = {
  path: string,
  params: RouteParams,
  props: RouteProps,
}

export type SyncResolver = (
  args: ResolverArgs
) => ComponentType | Redirection

export type AsyncResolver = (
  args: ResolverArgs
) => PromiseLike<ComponentType | ComponentModule | Redirection>

export type Route = {
  path: string,
  component?: ComponentType,
  resolver?: SyncResolver | AsyncResolver,
}
