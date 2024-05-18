<script>
  import { link } from "svelte-spa-history-router";

  import { getArticles } from "../articles.js";
</script>
<svelte:head>
  <title>Blog</title>
</svelte:head>
<main class="blog">
  <h1>Blog</h1>
  <ul>
    {#await getArticles() then posts }
      {#each posts as post }
        <li>{post.date} - <a use:link href={post.url}>{post.title}</a></li>
      {/each}
    {/await}
  </ul>
</main>
