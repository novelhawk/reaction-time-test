// import html from '@rollup/plugin-html'
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollupPluginHTML } from '@web/rollup-plugin-html';

// export default {
//   input: 'src/index.html',
//   output: { dir: 'dist' },
//   plugins: [rollupPluginHTML()],
// };

export default [
  {
    input: 'src/reactiontime.js',
    output: {
      dir: 'dist',
      format: 'iife',
    },
    plugins: [nodeResolve(), commonjs()],
  },
];
