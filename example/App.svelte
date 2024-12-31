<script lang="ts">
  import type { Route } from "svelte-spa-history-router"
  import { Router, link, push, redirect } from "svelte-spa-history-router"

  import type Admin from "./pages/Admin.svelte"
  import type Blog from "./pages/Blog.svelte"
  import type BlogPost from "./pages/BlogPost.svelte"
  import type Query from "./pages/Query.svelte"

  import IntParam from "./pages/IntParam.svelte"
  import Message from "./pages/Message.svelte"
  import NotFound from "./pages/NotFound.svelte"
  import Params from "./pages/Params.svelte"
  import Top from "./pages/Top.svelte"

  import { getArticle } from "./lib/getArticle"


  const routes: [
    Route,
    Route<typeof Params>,
    Route<typeof IntParam>,
    Route<typeof IntParam | typeof Message>,
    Route<typeof Blog>,
    Route<typeof BlogPost | typeof NotFound>,
    Route<typeof Admin>,
    Route<typeof Query>,
    Route<typeof NotFound>,
  ] = [
    { path: "/", component: Top },
    // path variable via params
    { path: "/params/(?<slug>.*)", component: Params },
    // typed props
    {
      path: "/int-param/(?<num>\\d+)",
      resolver: (params: Record<"num", string>) => ({
        component: IntParam,
        props: { num: parseInt(params.num) }
      }),
    },
    {
      path: "/conditional/(?<arg>.+)",
      resolver: (params: Record<"arg", string>) => {
        const arg = parseInt(params.arg)
        if (!Number.isNaN(arg)) {
          return { component: IntParam, props: { num: arg }}
        }
        return {
          component: Message,
          props: { message: `Unexpected param: ${params.arg}` }
        }
      }
    },
    // spliting
    {
      path: "/blog",
      resolver: () => import("./pages/Blog.svelte"),
    },
    // async resolver with props
    // path variable with slash
    // prefetch
    // spliting
    // return component
    {
      path: "/blog/posts/(?<slug>.*)",
      resolver: async (params: Record<"slug", string>) => {
        const article = await getArticle(params.slug);
        if (article) {
          const component = (await import("./pages/BlogPost.svelte")).default;
          return { component, props: { article } }
        } else {
          return NotFound;
        }
      },
    },
    // guard
    // redirect
    {
      path: "/admin",
      resolver: () => {
        if (user === "admin") {
          return import("./pages/Admin.svelte");
        } else {
          return redirect("/");
        }
      },
    },
    {
      path: "/query",
      resolver: () => import("./pages/Query.svelte")
    },
    { path: ".*", component: NotFound },
  ]

  let user = $state("anonymous");
</script>
<main>
  <header>
    <nav>
      <a use:link href="/">Top</a> |
      <a use:link href="/params/foo/bar">params</a> |
      <a use:link href="/int-param/3">int param</a> |
      <a use:link href="/conditional/1">conditional (1)</a> |
      <a use:link href="/conditional/a">conditional (a)</a> |
      <a use:link href="/blog">blog</a> |
      <a use:link href="/admin">admin</a> |
      <a use:link href="/query">query</a> |

      {#if user === "anonymous"}
        <button id="login" onclick={() => { user = "admin" }}>Login</button>
      {:else}
        user: { user } <button onclick={() => { user = "anonymous"; push("/"); }}>Logout</button>
      {/if}
    </nav>
  </header>
  <Router {routes} />
</main>
