<script>
  import { link } from '../src/index';
  import { routeParams } from '../src/stores';

  import { getArticle } from './data-source';

  let article = null;

  $: if ($routeParams.postId) { refresh() };

  async function refresh() {
    article = await getArticle($routeParams.postId);
    window.document.title = article.title;
  }
</script>

<div class="article">
  {#if article}
  <h1>{article.title}</h1>
  {@html article.html}
  <div>
    {#if article.previous}<a use:link href={`/posts/${article.previous}`}>Prev</a>{/if}
    {#if article.next}<a use:link href={`/posts/${article.next}`}>Next</a>{/if}
  </div>
  {/if}
</div>
