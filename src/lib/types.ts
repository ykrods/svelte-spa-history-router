import type { Component, ComponentProps } from "svelte";

import * as SpaEvent from "./spa-event"

export type NavigationEvent = CustomEvent<{ next: string }>;


declare global {
  interface WindowEventMap {
    [SpaEvent.NAVIGATE]: NavigationEvent
  }
}


export interface Redirection {
  redirect: string
}

export interface Destination<T extends Component<any>> {
  component: T
  props: ComponentProps<T>
}

type DestMap<T extends Component<any>> = T extends unknown ? Destination<T>: never;

export type Route<T extends Component<any> = Component> = {
  path: string
  component?: T
  resolver?: (params: Record<string, string>) =>
    | DestMap<T>
    | T
    | Redirection
    | Promise<DestMap<T> | T | Redirection | { default: T }>
}

export interface SpaContext {
  currentURL(): URL
}

/*
export type ResolverArgs = {
  path: string,
  params: RouteParams,
  props: RouteProps,
}
*/
