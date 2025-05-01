# svelte-spa-history-router

A history-based router for [Svelte](https://svelte.dev/) Single Page Applications (SPAs).

> [!TIP]
> Svelte's official routing library is [SvelteKit](https://svelte.dev/docs/kit/introduction). This library is designed for small or simple projects.

## Features

- History-Based Routing
- Path matching and Variable Capture using regular expressions
- Resolver for dynamic routing, code splitting, data preloading, etc.

## Features *not* supported

- Hash-based Routing
- Nested router
- Server-Side Rendering (SSR)

## Install

```sh
$ npm install --save-dev svelte-spa-history-router
$ # or
$ yarn add svelte-spa-history-router
```

## Usage

Import `Router` and include it in your main component (typically App.svelte).

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

* `Router` requires the `routes` parameter.
* `routes` is a list of route objects. Each route object must have a `path` property, and either a `component` or `resolver` property.

  * `path` can be a regular expression. `^` and `$` are automatically added when matching.
  * `component` is a Svelte component. There are no specific requirements for the component.
  * `resolver` is a function to return a dynamic component and return props of the type expected by the component.

* Matching is simply performed in the order defined by `routes`.

### Path variable

For routes that do not use a resolver, matched parameters are passed to the component via the `params` prop.

For example:

```html
# App.svelte
<script>
  import { Router } from "svelte-spa-history-router";
  import ItemPage from "./ItemPage.svelte";

  const routes = [
    { path: "/items/(?<itemId>\\d+)", component: ItemPage },
  ];
</script>
<Router {routes}/>
```

```html
# ItemPage.svelte

<script lang="ts">
  let { params }: { params: { itemId: string } } = $props();

  const itemId = $derived(parseInt(params.itemId));
</script>
<div>
  { itemId }
</div>
```

### Navigation methods

To navigate to another page, `link` and `push` are available.

* `link` turns an `<a>` tag into a spa navigation link. For example:

```html
<script>
  import { link } from 'svelte-spa-history-router';
</script>

<a use:link href="/">Home</a>
```

* `push` navigates to the given path programatically.

```html
<script>
  import { push } from 'svelte-spa-history-router';
<script>

<button onclick={ () => push('/') }>Go to Home</button>
```

### resolver

A resolver is a mechanism for dynamically determining which component to render. It can be used for various purposes, such as:

Example: code splitting (dynamic import)

```html
<script>
  import { Router } from 'svelte-spa-history-router';

  const routes = [
    { path: '/', resolver: () => import("Home.svelte") },
  ];
</script>
<Router {routes}/>
```

Example: dynamic routing and pass value to component props.

```html
<script lang="ts">
  import { Router } from 'svelte-spa-history-router';

  import Article from "./Article.svelte";
  import NotFound from "./NotFound.svelte";

  async function prefetchArticle(params: Record<string, string>) {
    const article = await getArticle(params.postId);
    if (article) {
      return { component: Article, props: { article } };
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

> [!TIP]
> This routing mechanism allows preloading data before rendering the component, minimizing layout flicker and improving perceived performance. While skeleton screens are a common modern pattern, this approach can simplify state handling in simple apps.

Example: guard

```html
<script lang="ts">
  import { Router, redirect } from 'svelte-spa-history-router';

  import Admin from "./Admin.svelte";


  let user: User = $state()

  function adminGuard() {
    if (!isAdmin(user)) {
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

A resolver must return one of the following types:

```typescript
| Component
| { component: Component, props: ComponentProps }
| Redirection // return value of `redirect()`
| Promise<
   | Component
   | { component: Component, props: ComponentProps }
   | Redirection
   | { default: Component } // return value of `import()`
  >
```

(Added in v2.0.0)

(Changed resolver interface in v3.0.0-next.1)

### currentURL()

state to detect URL changes (including query string or hash)

```html
<script>
  import { currentURL } from "svelte-spa-history-router";

  let name = $derived(currentURL().searchParams.get("name") ?? "unknown");
</script>
<div>{ name }</div>
```

(Added in v2.1.0)

(Replaced with Svelte5's `$state()` in v3.0.0-next.1)

### Typing

svelte-spa-history-router provides `Route` type to check combination of component and props.

```typescript
<script lang="ts">
  import type { Route } from "svelte-spa-history-router"

  // BlogPost requires article property
  import type BlogPost from "./pages/BlogPost.svelte"

  import Top from "./pages/Top.svelte"

  const routes: [
    Route<typeof Top>,
    Route<typeof BlogPost | typeof NotFound>,
  ] = [
    { path: "/", component: Top },
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
  ];
</script>
```

(Added in v3.0.0-next.1)

### Full example:

[example](https://github.com/ykrods/svelte-spa-history-router/tree/main/src)

## ChangeLog

[ChangeLog](https://github.com/ykrods/svelte-spa-history-router/tree/main/ChangeLog.md)

## License

MIT License.

## Appendix

A history-based router generally requires server-side routing to support direct links or page reloads.

For example, the following nginx configuration allows proper routing:

```
location / {
    try_files $uri /index.html =404;
}
```

If you are considering using firebase hosting for your application, [rewrite](https://firebase.google.com/docs/hosting/full-config#rewrites) may be useful.

## Inspired

svelte-spa-history-router is inspired by [svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router) and [Svelte Router SPA](https://github.com/jorgegorka/svelte-router).

If you don't need support for both history-based routing and regular expressions, I recommend these powerful routers.
