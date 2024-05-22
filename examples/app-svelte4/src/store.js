/**
 * @template T
 * @typedef { import("svelte/store").Writable<T> } Writable
 */

import { writable } from 'svelte/store';

/**
 * @type { Writable<String | null> }
 */
export const user = writable(null);
