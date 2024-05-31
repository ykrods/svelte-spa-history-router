import type { ComponentType } from "svelte";
import type { Readable } from "svelte/store";


export type RouteParams = {
  [key: string]: string
}

export type RouteProps = {
  [key: string]: any
}

export type ComponentModule<T = ComponentType> = {
  default: T,
}

export type Redirection = {
  redirect: string,
}

export interface CurrentURL extends Readable<URL> {
  set: (url: URL) => void
  setCurrent: () => void
}

export type RouteState<T = ComponentType> = {
  component: T,
  params: RouteParams,
  props: RouteProps,
}

export type ResolverArgs = {
  path: string,
  params: RouteParams,
  props: RouteProps,
}

export type SyncResolver<T = ComponentType> = (
  args: ResolverArgs
) => T | Redirection

export type AsyncResolver<T = ComponentType> = (
  args: ResolverArgs
) => Promise<T | ComponentModule<T> | Redirection>

export type Route<T = ComponentType> = {
  path: string,
  component?: T,
  resolver?: SyncResolver<T> | AsyncResolver<T>,
}
