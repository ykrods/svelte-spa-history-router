<script>
  import { onMount } from 'svelte';

  import { currentPath, currentRoute } from './stores';
  import { push } from './push';

  // @type{Array.{path: string, component: SvelteComponent}}
  export let routes = [];

  $: if (Array.isArray(routes) === false) {
    throw new Error(`routes should be Array, given: ${typeof routes}`);
  }

  onMount(() => {
    const popstateListener = (evt) => {
      currentPath.set(window.location.pathname);
    };

    window.addEventListener('popstate', popstateListener);

    return () => {
      window.removeEventListener('popstate', popstateListener);
    };
  });

  $: onCurrentPathChanged($currentPath);

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
