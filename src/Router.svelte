<script>
  /**
   * @typedef { import("./types").Route } Route
   */

  import { onMount } from 'svelte';

  import { currentPath, routeState, currentURL } from './stores.js';
  import { push } from './push.js';
  import { RouteState } from "./route_state.js";

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
    const state = resolveRoute(currentPath);

    const redirect = await state.resolveComponent();
    if (redirect) {
      push(redirect);
      return;
    }

    routeState.set(state);
  }

  /**
   * @param {string} currentPath
   * @return {RouteState}
   */
  function resolveRoute(currentPath) {

    for (const route of routes) {
      const re = new RegExp(`^${route.path}$`, 'i');
      const match = currentPath.match(re);
      if (match) {
        return new RouteState(route, match.groups, {});
      }
    };

    throw new Error(`No route for ${currentPath} exists.`);
  }

  $: currentComponent = ($routeState && $routeState.component) || null;
  $: currentProps = ($routeState && $routeState.props) || {};
</script>

<svelte:component this="{currentComponent}" {...currentProps} />
