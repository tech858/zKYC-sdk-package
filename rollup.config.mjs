import resolve from '@rollup/plugin-node-resolve';
import babel   from '@rollup/plugin-babel';
import terser  from '@rollup/plugin-terser';
import dts     from 'rollup-plugin-dts';

export default [
  // — ESM bundle —
  {
    input: 'src/index.js',
    output: {
      file: 'dist/shuftites-redirect-sdk.esm.js',
      format: 'esm',
    },
    plugins: [
      resolve(),
      babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
      terser(),
    ],
  },

  // — UMD bundle —
  {
    input: 'src/index.js',
    output: {
      file: 'dist/shuftites-redirect-sdk.umd.js',
      format: 'umd',
      name: 'ShuftitesRedirectSDK',
      exports: 'named',
    },
    plugins: [
      resolve(),
      babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
      terser(),
    ],
  },

  // — Type declarations bundle —
  {
    input: 'src/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [ dts() ],
  },
];
