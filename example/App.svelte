<script>
  import { Router, link, redirect } from '../src/index';

  import { user } from './store';
  import { getArticle } from './data-source';

  // static routes
  import Home from './Home.svelte';
  import Admin from './Admin.svelte';
  import Login from './Login.svelte';
  import NotFound from "./NotFound.svelte";

  function adminGuard(route) {
    if ($user === null) {
      return redirect("/login");
    } else {
      return Admin;
    }
  }

  async function prefetchArticle(route) {
    const article = await getArticle(route.params.postId);
    if (article) {
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
    { path: '/login', component: Login },
  ];
</script>

<div class="nav">
  <ul>
    <li><a use:link href="/">Home</a></li>
    <li><a use:link href="/admin">Admin</a></li>
    <li><a use:link href="/login">Login</a></li>
  </ul>
</div>

<Router {routes}/>
