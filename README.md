# svelte-spa-history-router

History base router for Svelte 3 SPA (Single Page Application).

## Features

- History-base routing
- Regular expression is supported for path matching and caputuring path variables
- Navigation guard

## *Not* supported features

- Hash-base routing
- Nested router
- SSR (Server Side Rendering)

## Install

```sh
$ npm install --save-dev svelte-spa-history-router
$ # or
$ yarn add svelte-spa-history-router
```

## Usage

Import `Route` and put into your main component (typically App.svelte).

For example:

```html
# App.svelte

<script>
  import { Router } from 'svelte-spa-history-router';

  import Home from './Home.svelte';
  import Article from './Article.svelte';
  import NotFound from './NotFound.svelte';

  const routes = [
    { path: '/', component: Home},
    { path: '/posts/(?<postId>.*)', component: Article},
    { path: '.*', component: NotFound},
  ];
</script>
<Router {routes}/>
```

* `Routes` require a `routes` parameter.
* `routes` is a list of route objects. route object has `path`, `component`, and `guard` properties.

  * `path` can be a regular expression. `^` and `$` are automatically added when matching.
  * `component` is a SvelteComponent. there are no specific requirements for component.
  * `guard` is guard function (optional).

* Matching is simply performed in the order defined by `routes`.

### routeParams

`routeParams` is a store to contain matched value to current route.

For example:

```html
# Article.svelte

<script>
  import { routeParams } from 'svelte-spa-history-router';
</script>

<div class="article">
  postId: {$routeParams.postId}
</div>
```

### Navitation methods

To navigate another page, `link` and `push` are available.

* `link` used with a `a` tag like below

```html
import { link } from 'svelte-spa-history-router';

<a use:link href="/">Home</a>
```

* `push` used to navigate programatically

```html
import { push } from 'svelte-spa-history-router';

<button on:click={ () => push('/') }>Go to Home</button>
```

### Navigation guard

(Added in v1.1.0)

Navigation guard is a route option to check if a visitor can navigate its route.

```html
# App.svelte

<script>
  import { Router } from 'svelte-spa-history-router';

  import Home from './Home.svelte';
  import Admin from './Admin.svelte';

  function adminGuard(from, to, next) {
    if (isAdminUser() === true) {
      next();
    } else {
      next("/"); // Redirect to "/"
    }
  }

  const routes = [
    { path: '/', component: Home},
    { path: '/admin', component: Admin, guard: adminGuard},
    { path: '.*', component: NotFound},
  ];
</script>
<Router {routes}/>
```

guard function is called with three arguments: `from`, `to`, and `next`

* `from` : current route object
* `to` : new route object
* `next:` : function to determine navigation. `next()` will navigate as is and `next("/")` will redirect to another page.

### Full example:

[example](https://github.com/ykrods/svelte-spa-history-router/tree/master/example)

## ChangeLog

### 1.1.1 (2021-04-12)

* Fix bug with async guard function causing loop

### 1.1.0 (2021-03-26)

* Add guard

### 1.0.2

* Fix import error

## License

MIT License.

## Appendix

Generally, history-base router requires server-side routing so that user can open the direct link or reload.

For example, Nginx excerpt configuration is like bellow.

```
location / {
    try_files $uri /index.html =404;
}
```

If you consider to use firebase hosting for your application, [rewrite](https://firebase.google.com/docs/hosting/full-config#rewrites) may be useful.

## Inspired

svelte-spa-history-router is inspired by [svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router) and [Svelte Router SPA](https://github.com/jorgegorka/svelte-router).

If you don't need both history-base and regular expression support, I reccommend these powerful routers.
