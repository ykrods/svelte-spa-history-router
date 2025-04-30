import type { Redirection } from "./types"

/**
 * This is special function used in resolvers.
 * Normally, you use `push()` to change the url.
 */
export function redirect(to: string): Redirection {
  return { redirect: to };
}
