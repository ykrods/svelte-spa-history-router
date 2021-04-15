import svelte from 'rollup-plugin-svelte';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    sourcemap: true,
    name: 'app',
    format: 'esm',
    dir: 'dist/',
    chunkFileNames: '[name].js'
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
    include: ['./**', '../src/**'],
    chokidar: false,
    clearScreen: false,
  },
};
