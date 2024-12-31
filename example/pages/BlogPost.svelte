<script lang="ts">
  import type { Article } from "../types"

  import { link } from "svelte-spa-history-router"

  let { article }: { article: Article } = $props()
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
      <a use:link href={`/blog/posts/${article.prev}`}>prev</a>
    {/if}
    {#if article.next }
      <a use:link href={`/blog/posts/${article.next}`}>next</a>
    {/if}
  </div>
</main>
