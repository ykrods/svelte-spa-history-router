import { mount } from "svelte";

import App from './App.svelte';

const target = /** @type {HTMLElement} */(document.getElementById('app'));

const app = mount(App, { target });

export default app;
