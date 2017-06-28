import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/script/index.js',
  dest: 'build/script.js',
  format: 'iife',
  plugins: [buble()],
  treeshake: false,
};
