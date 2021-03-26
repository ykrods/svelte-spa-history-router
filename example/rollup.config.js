import svelte from 'rollup-plugin-svelte';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'dist/bundle.js'
  },
  plugins: [
    svelte({
      extensions: ['.svelte'],
      compilerOptions: {
        // enable run-time checks when not in production
        dev: true,
      }
    }),

    // to resolve (import) thrid-party libs
    nodeResolve({
      browser: true,
      dedupe: ['svelte']
    }),
  ],
  watch: {
    include: './**',
    chokidar: false,
    clearScreen: false,
  },
};
