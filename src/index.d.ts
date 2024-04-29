///<reference types="svelte" />

import { SvelteComponent, ComponentType } from 'svelte'

export { Route, RouteParams, Redirection } from "./types.ts"

/**
 * Router component
 *
 * @example
 *  <script>
 *    import { Router } from "svelte-spa-history-router";
 *
 *    import Top from "./Top.svelte"
 *    import NotFound from "./NotFound.svelte"
 *
 *    const routes = [
 *      { path: "/", component: Top },
 *      { path: "/posts/(?<postId>.*)", resolver: () => import("./Article.svelte") },
 *      { path: ".*", component: NotFound },
 *    ];
 *  </script>
 *  <Router {routes}/>
 */
export class Router extends SvelteComponent<{
    routes: Route[]
}> {}

export { link } from "./link.js";
export { push } from "./push.js";
export { routeParams, currentURL } from "./stores.js";

/**
 * This is special function used in resolvers.
 * Normally, you use `push()` to change the url.
 *
 * @param {string} to
 * @return {Redirection}
 */
export function redirect(to: string): Redirection;
