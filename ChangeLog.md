# ChangeLog

## 3.0.0 (2025-05-01)

* chore: add `@sveltejs/package` to generate types of svelte components

## 3.0.0-next.1 (2025-01-10)

* *[Breaking change]* Drop Svelte4 support

  * Remove stores of `routeParams` and `currentURL`

* *[Breaking change]* Change resolver interface
* Add `currentURL()` which is rewriten to use `$state()`

## 2.2.0

* Support Svelte5

## 2.2.0-next.1

* Fix component type on svelte5 [PR13](https://github.com/ykrods/svelte-spa-history-router/pull/13)

## 2.2.0-next.0

* Add the way to get routing params to via props [PR12](https://github.com/ykrods/svelte-spa-history-router/pull/12)
* Refactor (changes: [2.1.2...7b7795b](https://github.com/ykrods/svelte-spa-history-router/compare/2.1.2...7b7795b2675c452a1a189d3931c0c4c9abb04c51) )

## 2.1.2 (2024-04-29)

* Support types [PR10](https://github.com/ykrods/svelte-spa-history-router/pull/10)

## 2.1.1 (2024-01-13)

* ~~Support Types~~ Add typecheck [PR9](https://github.com/ykrods/svelte-spa-history-router/pull/9)

## 2.1.0 (2021-04-29)

* Add `currentURL` store to detect URL changes [PR6](https://github.com/ykrods/svelte-spa-history-router/pull/6)

## 2.0.0 (2021-04-15)

* [Added] resolver
* [Removed] guard

## 1.1.1 (2021-04-12)

* Fix bug with async guard function causing loop

## 1.1.0 (2021-03-26)

* Add guard

## 1.0.2

* Fix import error
