# svelte-spa-history-router

History base router for Svelte 3 SPA (Single Page Application).

## Features

- History-base routing
- path matching and path variable capturing by regular expression
- resolver (for dynamic routing, code-splitting, data preloading, etc...)

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

Import `Router` and put into your main component (typically App.svelte).

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
* `routes` is a list of route objects. route object has `path`, `component`, and `resolver` properties.

  * `path` can be a regular expression. `^` and `$` are automatically added when matching.
  * `component` is a SvelteComponent. there are no specific requirements for component.
  * `resolver` is a function to determine component dynamically (optional).

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

### Navigation methods

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

### resolver

Resolver is a mechanism to dynamically determine component and can be used in multiple use cases.

Example: code spliting (dynamic import)

```html
<script>
  import { Router } from 'svelte-spa-history-router';

  const routes = [
    { path: '/', resolver: _ => import("Home.svelte") },
  ];
</script>
<Router {routes}/>
```

Example: dynamic routing and pass value to component props.

```html
<script>
  import { Router } from 'svelte-spa-history-router';

  import Article from "./Article.svelte";
  import NotFound from "./NotFound.svelte";

  async function prefetchArticle(route) {
    const article = await getArticle(route.params.postId);
    if (article) {
      // pass value to component props
      route.props.article = article;
      return Article;
    } else {
      return NotFound;
    }
  }

  const routes = [
    { path: '/posts/(?<postId>.*)', resolver: prefetchArticle },
  ];
</script>
<Router {routes}/>
```

Example: guard

```html
<script>
  import { Router, redirect } from 'svelte-spa-history-router';

  import Admin from "./Admin.svelte";

  function adminGuard(route) {
    if (!isAdmin($user)) {
      return redirect("/");
    }
    return Admin;
  }

  const routes = [
    { path: '/', component: Home },
    { path: '/admin', resolver: adminGuard },
  ];
</script>
<Router {routes}/>
```

(Added in v2.0.0)

### currentURL

store to detect URL changes (including query string or hash)

```html
<script>
  import { currentURL } from "svelte-spa-history-router";

  $: name = $currentURL.searchParams.get("name") || 'unknown';
</script>
<div>{ name }</div>
```

(Added in 2.1.0)

### Full example:

[example](https://github.com/ykrods/svelte-spa-history-router/tree/master/example)

## ChangeLog

### 2.2.0-next.1

* Fix component type on svelte5 [PR13](https://github.com/ykrods/svelte-spa-history-router/pull/13)

### 2.2.0-next.0

* Add the way to get routing params to via props [PR12](https://github.com/ykrods/svelte-spa-history-router/pull/12)
* Refactor (changes: [2.1.2...7b7795b](https://github.com/ykrods/svelte-spa-history-router/compare/2.1.2...7b7795b2675c452a1a189d3931c0c4c9abb04c51) )

### 2.1.2 (2024-04-29)

* Support types [PR10](https://github.com/ykrods/svelte-spa-history-router/pull/10)

### 2.1.1 (2024-01-13)

* ~~Support Types~~ Add typecheck [PR9](https://github.com/ykrods/svelte-spa-history-router/pull/9)

### 2.1.0 (2021-04-29)

* Add `currentURL` store to detect URL changes [PR6](https://github.com/ykrods/svelte-spa-history-router/pull/6)

### 2.0.0 (2021-04-15)

* [Added] resolver
* [Removed] guard

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
