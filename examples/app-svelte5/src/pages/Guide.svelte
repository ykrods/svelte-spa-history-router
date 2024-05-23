<script lang="ts">
  import type { RouteParams } from "svelte-spa-history-router";
  import { routeParams, link } from "svelte-spa-history-router";

  let { params }: { params: RouteParams } = $props();

  const guideId = $derived(parseInt(params.guideId));
</script>
<svelte:head>
  <title>Guide { guideId }</title>
</svelte:head>
<main class="guide">
  <h1>Guide { guideId }</h1>
  <p class="routeParams">routeParams: { $routeParams.guideId }</p>
  <p class="params">params: { params.guideId }</p>
  <ul>
    {#each [1, 2, 3] as idx }
      <li><a use:link href={`/guide/${idx}`}>guide({idx})</a></li>
    {/each}
  </ul>
</main>
