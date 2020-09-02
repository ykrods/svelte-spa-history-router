<script>
  import { onMount } from 'svelte';

  import { link, push } from '../src/index';

  import { getArticles } from './data-source';

  let articlesPromise = getArticles();

  onMount(() => {
    window.document.title = 'Home';
  });
</script>

<div class="home">
  <h1>Home</h1>
  <div>
    <h2>Articles</h2>
    {#await articlesPromise}
    <p>Loading...</p>
    {:then articles}
    <ul>
      {#each articles as article}
      <li><a use:link href="{`/posts/${article.id}`}">{article.title}</a></li>
      {/each}
    </ul>
    {/await}
  </div>
  <button on:click="{() => push('/posts/test-param')}">Go to article</button>
</div>
