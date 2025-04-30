<!--
@component

Router component

@example
<script>
  import { Router } from "svelte-spa-history-router";

  import Top from "./Top.svelte"
  import NotFound from "./NotFound.svelte"

  const routes = [
    { path: "/", component: Top },
    { path: "/posts/(?<postId>.*)", resolver: () => import("./Article.svelte") },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
-->
<script lang="ts">
  import type { Component } from "svelte";
  import type { Route, NavigationEvent } from "./types";

  import * as SpaEvent from "./spa-event";
  import { setSpaContext } from "./spa-context";
  import { push } from './push.js';

  type Dest = { component: Component, props: Record<string, any> }


  let {
    routes
  }: {
    routes: Route<any>[]
  } = $props();

  let currentURL: URL = $state(new URL(window.location.href));
  // Exclude queryString and hash
  let currentPath: string = $derived.by(() => currentURL.pathname);
  let destination: Dest | undefined = $state(undefined);


  setSpaContext({
    currentURL: () => currentURL
  });

  $effect(() => {
    if (Array.isArray(routes) === false) {
      throw new Error(`routes should be Array, given: ${typeof routes}`);
    }
  })

  $effect(() => {
    const onNavigate = (evt: NavigationEvent) => {
      const url = new URL(evt.detail.next, window.location.origin);

      if (url.toString() !== currentURL.toString()) {
        currentURL = url;
        window.history.pushState({}, "", evt.detail.next);
      }
    }
    window.addEventListener(SpaEvent.NAVIGATE, onNavigate);

    const onPopState = () => {
      currentURL = new URL(window.location.href)
    }
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener(SpaEvent.NAVIGATE, onNavigate);
      window.removeEventListener('popstate', onPopState);
    };
  });

  $effect(() => {
    const { route, params } = resolveRoute(currentPath);

    createDestination(route, params).then((result) => {
      if (typeof result === "string") {
        push(result);
        return;
      }
      destination = result;
    });
  })

  function resolveRoute(path: string): {
    route: Route,
    params: Record<string, string>
  } {
    for (const route of routes) {
      const re = new RegExp(`^${route.path}$`, 'i');
      const match = path.match(re);
      if (match) {
        return { route, params: match.groups ?? {} };
      }
    };
    throw new Error(`No route for ${path} exists.`);
  }


  async function createDestination(
    route: Route,
    params: Record<string, string>
  ): Promise<Dest | string> {
    if (route.component) {
      return { component: route.component, props: { params } };

    } else if (typeof route.resolver === "function") {
      const resolved = await Promise.resolve(route.resolver(params));

      if ("redirect" in resolved) {
        return resolved.redirect;
      } if ("component" in resolved) {
        return resolved;
      } else if ("default" in resolved) {
        return { component: resolved.default, props: {} };
      } else {
        // assume resolved as component
        // XXX: is there a way to check if a object is svelte component or not?
        return { component: resolved, props: {} };
      }

    } else {
      const msg = `component or resolver is missing for ${route.path}`
      console.error(msg)
      throw new Error(msg);
    }
  }

  let CurrentComponent = $derived.by(() => destination?.component);
  let currentProps = $derived.by(() => destination?.props ?? {});
</script>
{#if CurrentComponent }
  <CurrentComponent {...currentProps}></CurrentComponent>
{/if}
