import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    // CSS entry — esbuild resolves the @import graph in src/styles/index.css
    // and emits a single bundled dist/styles.css
    styles: 'src/styles/index.css',
  },
  format: ['esm', 'cjs'],
  dts: {
    entry: 'src/index.ts',
  },
  clean: true,
  sourcemap: true,
  minify: false,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
});
