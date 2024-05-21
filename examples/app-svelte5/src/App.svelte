<script lang="ts">
  import type { ResolverArgs } from "svelte-spa-history-router";
  import { Router, push, link, redirect } from "svelte-spa-history-router";

  import Home from "./pages/Home.svelte";
  import Guide from "./pages/Guide.svelte";
  import NotFound from "./pages/NotFound.svelte";

  import { getArticle } from "./articles.js";

  let user = $state("anonymous");

  /**
   * FIXME: better to Use AsyncResolver type, but ComponentType cause error on currently svelte build
   */
  async function prefetchArticle({ params, props }: ResolverArgs) {
    const article = await getArticle(params.postId);
    if (article) {
      props.article = article;
      return import("./pages/Post.svelte");
    } else {
      return NotFound;
    }
  }

  const routes = [
    { path: "/", component: Home },
    { path: "/blog", resolver: () => import("./pages/Blog.svelte") },
    {
      path: '/blog/posts/(?<postId>.*)',
      resolver: prefetchArticle,
    },
    {
      path: "/guide/(?<guideId>\\d+)",
      component: Guide,
    },
    {
      path: "/admin",
      resolver: () => {
        if (user === "anonymous") {
          return redirect("/");
        } else {
          return import("./pages/Admin.svelte");
        }
      },
    },
    { path: ".*", component: NotFound },
  ];
</script>
<div>
  <header>
    <nav>
      <a use:link href="/">home</a> |
      <a use:link href="/blog">blog</a> |
      <a use:link href="/guide/1">guide(1)</a> |
      <a use:link href="/admin">admin</a> |
      user: { user }
      {#if user === "anonymous"}
        <button onclick={() => { user = "admin" }}>login</button>
      {:else}
        <button onclick={() => { user = "anonymous"; push("/"); }}>logout</button>
      {/if}
    </nav>
  </header>
  <Router {routes}/>
</div>
