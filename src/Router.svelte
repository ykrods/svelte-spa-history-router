<script>
  /**
   * @typedef { import("svelte").ComponentType } ComponentType
   *
   * @typedef { import("./types").ComponentModule } ComponentModule
   * @typedef { import("./types").Route } Route
   * @typedef { import("./types").Redirection } Redirection
   * @typedef { import("./types").RouteParams } RouteParams
   * @typedef { import("./types").RouteState } RouteState
   */

  import { onMount } from 'svelte';

  import { currentPath, routeState, currentURL } from './stores.js';
  import { push } from './push.js';

  /** @type { Array.<Route> } */
  export let routes = [];

  $: if (Array.isArray(routes) === false) {
    throw new Error(`routes should be Array, given: ${typeof routes}`);
  }

  onMount(() => {
    const onPopState = () => {
      currentPath.set(window.location.pathname);
      currentURL.setCurrent();
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  });

  $: onCurrentPathChanged(/** @type string */ ($currentPath));

  /**
   * @param {string} currentPath
   */
  async function onCurrentPathChanged(currentPath) {
    const { route, params } = resolveRoute(currentPath);

    const result = await resolveRouteState(route, params);
    if (typeof result === "string") {
      push(result);
      return;
    }
    routeState.set(/** @type {RouteState} */(result));
  }

  /**
   * @param {string} currentPath
   * @return {{ route: Route, params: RouteParams }}
   */
  function resolveRoute(currentPath) {

    for (const route of routes) {
      const re = new RegExp(`^${route.path}$`, 'i');
      const match = currentPath.match(re);
      if (match) {
        return { route, params: match.groups ?? {} };
      }
    };

    throw new Error(`No route for ${currentPath} exists.`);
  }

  /**
   * @param {Route} route
   * @param {RouteParams} params
   * @returns {Promise<string | RouteState>}
   */
  async function resolveRouteState(route, params) {
    let component = route.component;
    const props = {};

    if (typeof route.resolver === "function") {
      const resolved = await Promise.resolve(
        route.resolver({ path: route.path, params, props })
      );

      // NOTE: resolved could be a module namespece object
      // ( that is not regular object), so use Refrect
      if (Reflect.has(resolved, "redirect")) {
        return /** @type {Redirection} */(resolved).redirect;
      }

      // if resolver returns `import(...)`, it needs to retrieve .default
      if (Reflect.has(resolved, "default")) {
        component = /** @type {ComponentModule} */(resolved).default;
      } else {
        component = /** @type {ComponentType} */(resolved);
      }
    }
    if (!component) throw new Error("Component is not specified");

    return /** @type {RouteState} */({ params, component, props });
  }

  $: currentComponent = ($routeState && $routeState.component) ?? null;
  $: currentProps = ($routeState && $routeState.props) ?? {};
</script>

<svelte:component this={currentComponent} {...currentProps} />
