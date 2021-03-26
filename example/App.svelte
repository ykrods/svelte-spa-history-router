<script>
  import { Router, link } from '../src/index';

  import { user } from './store';

  import Home from './Home.svelte';
  import Article from './Article.svelte';
  import Admin from './Admin.svelte';
  import Login from './Login.svelte';

  function adminGuard(from, to, next) {
    if ($user === null) {
      next("/login");
    } else {
      next();
    }
  }

  const routes = [
    { path: '/', component: Home},
    { path: '/posts/(?<postId>.*)', component: Article},
    { path: '/admin', component: Admin, guard: adminGuard },
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
