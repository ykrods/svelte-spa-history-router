<script>
  import { onMount, tick } from 'svelte';

  import { currentPath, currentRoute } from './stores';
  import { push } from './push';

  // @type{Array.{path: string, component: SvelteComponent}}
  export let routes = [];

  $: if (Array.isArray(routes) === false) {
    throw new Error(`routes should be Array, given: ${typeof routes}`);
  }

  onMount(() => {
    // initialze
    currentPath.set(window.location.pathname);

    const popstateListener = (evt) => {
      currentPath.set(window.location.pathname);
    };

    window.addEventListener('popstate', popstateListener);

    return () => {
      window.removeEventListener('popstate', popstateListener);
    };
  });

  $: onCurrentPathChanged($currentPath);

  function onCurrentPathChanged(currentPath) {
    const route = resolveRoute(currentPath);

    if (route === null || typeof route.guard !== 'function') {
      currentRoute.set(route);
    } else {
      // guard
      const next = (redirect = null) => {
        if (typeof redirect === "string" ) {
          tick().then(() => push(redirect));
        } else {
          currentRoute.set(route);
        }
      };
      route.guard($currentRoute, route, next);
    }
  }

  $: currentComponent = ($currentRoute !== null) ? $currentRoute.component : null;

  function resolveRoute(currentPath) {
    if (!currentPath) {
      return null;
    }

    for (const route of routes) {
      const re = new RegExp(`^${route.path}$`, 'i');
      const match = currentPath.match(re);
      if (match) {
        return Object.assign({ params: match.groups }, route);
      }
    };

    throw new Error(`No route for ${currentPath} exists.`);
  }
</script>

<svelte:component this="{currentComponent}" />
