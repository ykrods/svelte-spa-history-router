<script>
  /**
   * @typedef {import("svelte").SvelteComponent} SvelteComponent
   *
   * @typedef {Object} Route
   * @property {string} path
   * @property {SvelteComponent=} component
   * @property {function=} resolver
   */

  import { onMount } from 'svelte';

  import { currentPath, currentRoute, currentURL } from './stores.js';
  import { push } from './push.js';


  /** @type {Array.<Route>} */
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
    const route = resolveRoute(currentPath);

    if (typeof route.resolver === "function") {
      const resolved = await Promise.resolve(route.resolver(route));
      if (resolved.redirect) {
        push(resolved.redirect);
        return;
      }
      // if resolver returns `import(...)`, it needs to retrieve .default
      route.component = resolved.default || resolved;
    }

    currentRoute.set(route);
  }

  /**
   * @param {string} currentPath
   * @return {Route}
   */
  function resolveRoute(currentPath) {

    for (const route of routes) {
      const re = new RegExp(`^${route.path}$`, 'i');
      const match = currentPath.match(re);
      if (match) {
        return Object.assign({}, route, { params: match.groups, props: {}});
      }
    };

    throw new Error(`No route for ${currentPath} exists.`);
  }

  $: currentComponent = ($currentRoute && $currentRoute.component) || null;
  $: currentProps = ($currentRoute && $currentRoute.props) || {};
</script>

<svelte:component this="{currentComponent}" {...currentProps} />
