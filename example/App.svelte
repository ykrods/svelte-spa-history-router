<script>
  import { Router, link } from '../src/index';

  import Home from './Home.svelte';
  import Article from './Article.svelte';

  const routes = [
    { path: '/', component: Home},
    { path: '/posts/(?<postId>.*)', component: Article},
  ];
</script>

<div class="nav">
  <ul>
    <li><a use:link href="/">Home</a></li>
  </ul>
</div>

<Router {routes}/>
