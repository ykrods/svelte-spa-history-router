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
      // enable run-time checks when not in production
      dev: true,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: css => {
        css.write('bundle.css');
      },
    }),

    // to resolve (import) thrid-party libs
    nodeResolve({
      browser: true,
      dedupe: ['svelte']
    }),
  ],
};
