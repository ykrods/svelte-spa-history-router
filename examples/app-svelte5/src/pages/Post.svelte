<script>
  import { link, routeParams } from "svelte-spa-history-router";

  export let article;
</script>
<svelte:head>
  <title>{ article.title }</title>
</svelte:head>
<main class="post">
  <h1>{ article.title }</h1>
  <div>{ article.date }</div>
  <div>{@html article.html }</div>
  <div>
    {#if article.prev }
      <a use:link href={article.prev}>prev</a>
    {/if}
    {#if article.next }
      <a use:link href={article.next}>next</a>
    {/if}
  </div>
</main>
