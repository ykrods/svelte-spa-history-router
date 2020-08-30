<script>
  import { onMount } from 'svelte';

  import { currentPath, currentRoute } from './stores';

  // @type{Array.{path: string, component: SvelteComponent}}
  export let routes = [];

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

  $: currentRoute.set(resolveRoute($currentPath));
  $: currentComponent = ($currentRoute !== null) ? $currentRoute.component : null;

  function resolveRoute(currentPath) {
    if (!currentPath) {
      return null;
    }

    for (const { path, component } of routes) {
      const re = new RegExp(`^${path}$`, 'i');
      const match = currentPath.match(re);
      if (match) {
        return { path, component, params: match.groups };
      }
    };

    throw new Error(`No route for ${currentPath} exists.`);
  }
</script>

<svelte:component this="{currentComponent}" />
