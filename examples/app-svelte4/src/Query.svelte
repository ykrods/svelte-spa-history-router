<script>
  import { link, currentURL } from "svelte-spa-history-router";

  $: name = $currentURL.searchParams.get("name") || 'unknown';
</script>
<svelte:head>
  <title>query</title>
</svelte:head>
<div class="query">
  <p>name: <span id="name">{ name }</span></p>
  <a use:link href="/query?name=foo">foo</a>
  <a use:link href="/query?name=bar">bar</a>
</div>
