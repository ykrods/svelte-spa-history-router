<script>
  import { link } from '../src/index.js';
  import { routeParams } from '../src/stores.js';

  export let article;

  $: if ($routeParams.postId) {
    console.log($routeParams.postId);
  };
</script>

<svelte:head>
  <title>{ article.title }</title>
</svelte:head>
<div class="article">
  <h1>{article.title}</h1>
  {@html article.html}
  <div>
    {#if article.previous}<a use:link href={`/posts/${article.previous}`}>Prev</a>{/if}
    {#if article.next}<a use:link href={`/posts/${article.next}`}>Next</a>{/if}
  </div>
</div>
