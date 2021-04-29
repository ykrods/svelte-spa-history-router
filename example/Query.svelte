<script>
  import { link } from "../src/link.js";
  import { currentURL } from "../src/stores.js";

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
