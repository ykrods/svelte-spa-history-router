<script>
  import { Router, link, redirect } from '../src/index.js';

  import { user } from './store.js';
  import { getArticle } from './data-source.js';

  // static routes
  import Home from './Home.svelte';
  import Admin from './Admin.svelte';
  import NotFound from "./NotFound.svelte";

  function adminGuard() {
    if ($user === null) {
      return redirect("/login");
    } else {
      return Admin;
    }
  }

  /**
   * @param {import("../src/types").RouteState} route
   */
  async function prefetchArticle(route) {
    const article = await getArticle(route.params.postId);
    if (article) {
      // pass value to component props
      route.props.article = article;
      return import("./Article.svelte");
    } else {
      return NotFound;
    }
  }

  const routes = [
    { path: '/', component: Home},
    { path: '/posts/(?<postId>.*)', resolver: prefetchArticle },
    { path: '/admin', resolver: adminGuard },
    { path: '/login', resolver: () => import("./Login.svelte") },
    { path: '/query', resolver: () => import("./Query.svelte") },
  ];
</script>

<div class="nav">
  <ul>
    <li><a use:link href="/">Home</a></li>
    <li><a use:link href="/admin">Admin</a></li>
    <li><a use:link href="/login">Login</a></li>
    <li><a use:link href="/query">Query</a></li>
  </ul>
</div>

<Router {routes}/>
