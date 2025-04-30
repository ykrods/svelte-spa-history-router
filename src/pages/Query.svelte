<script>
  import { link, currentURL } from "../lib/index"


  let name = $derived(currentURL().searchParams.get("name") ?? 'unknown');
</script>
<svelte:head>
  <title>query</title>
</svelte:head>
<main class="query">
  <p>name: <span id="name">{ name }</span></p>
  <a use:link href="/query?name=foo">foo</a>
  <a use:link href="/query?name=bar">bar</a>
</main>
