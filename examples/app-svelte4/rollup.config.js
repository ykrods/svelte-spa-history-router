import child_process from "node:child_process";

import svelte from 'rollup-plugin-svelte';
import nodeResolve from '@rollup/plugin-node-resolve';


const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
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

    !production && serve(),
  ],
  watch: {
    include: ['./src/**', '../../src/**'],
    chokidar: false,
    clearScreen: false,
  },
};

function serve() {
  let started = false;
  return {
    writeBundle() {
      if (!started) {
        started = true;

        child_process.spawn("npm", ["run", "start"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true
        });
      }
    }
  };
}
