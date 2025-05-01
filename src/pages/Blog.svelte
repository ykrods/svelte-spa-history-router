<script lang="ts">
  import { link } from "../lib/index"

  import { getArticles } from "../getArticles"
</script>
<svelte:head>
  <title>Blog</title>
</svelte:head>
<main class="blog">
  {#await getArticles() then articles}
  <h1>Blog</h1>
  <ul>
      {#each articles as article}
        <li>{ article.date } - <a use:link href={`/blog/posts/${article.id}`}>{ article.title }</a></li>
      {/each}
      <li>2024-01-01 - <a use:link href="/blog/posts/2024/01/01/deleted">deleted</a></li>
  </ul>
  {/await}
</main>
