/**
 * @typedef { import("svelte").ComponentType } ComponentType
 * @typedef { import("./types").Route } Route
 * @typedef { import("./types").RouteParams } RouteParams
 * @typedef { import("./types").RouteProps } RouteProps
 * @typedef { import("./types").Redirection } Redirection
 * @typedef { import("./types").ComponentModule } ComponentModule
 */

export class RouteState {
  /**
   * @param {Route} route
   * @param {RouteParams} params
   * @param {RouteProps} props
   */
  constructor(route, params = {}, props = {}) {
    this.route = route;
    this.params = params;
    this.props = props;
    this.component = this.route.component || null;
  }

  /**
   * @return Redirection | undefined
   */
  async resolveComponent() {
    if (typeof this.route.resolver === "function") {
      const resolved = await Promise.resolve(this.route.resolver(this));

      // NOTE: resolved could be a module namespece object
      // ( that is not regular object), so use Refrect
      if (Reflect.has(resolved, "redirect")) {
        return /** @type {Redirection} */ (resolved).redirect;
      }

      // if resolver returns `import(...)`, it needs to retrieve .default
      if (Reflect.has(resolved, "default")) {
        this.component = /** @type {ComponentModule} */ (resolved).default;
        return;
      }
      this.component = /** @type {ComponentType} */ (resolved);
    }
  }
}
