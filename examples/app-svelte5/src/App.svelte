<script>
  import { Router, push, link, redirect } from "svelte-spa-history-router";

  import Home from "./pages/Home.svelte";
  import NotFound from "./pages/NotFound.svelte";

  import { getArticle } from "./articles.js";

  let user = $state("anonymous");

  async function prefetchArticle(route) {
    const article = await getArticle(route.params.postId);
    if (article) {
      route.props.article = article;
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
