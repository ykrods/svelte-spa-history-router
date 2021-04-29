<script>
  import { link, push } from '../src/index.js';

  import { getArticles } from './data-source.js';

  let articlesPromise = getArticles();

</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
<div class="home">
  <h1>Home</h1>
  <div>
    <h2>Articles</h2>
    {#await articlesPromise}
    <p>Loading...</p>
    {:then articles}
    <ul>
      {#each articles as article}
      <li><a use:link href={`/posts/${article.id}`}>{article.title}</a></li>
      {/each}
    </ul>
    {/await}
  </div>
  <button on:click={() => push('/posts/test-param')}>Go to article</button>
  <button on:click={() => push('/posts/deleted')}>Go to to deleted article </button>
</div>
