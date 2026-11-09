import { defineConfig } from 'tsup';
import { transform } from 'esbuild';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// The stylesheet ships inside the JS as a string; minify it first so comments and
// whitespace don't end up in every user's bundle.
const minifiedCss = {
  name: 'minified-css-text',
  setup(build: any) {
    // `./styles.css?inline` resolves into its own namespace, so tsup's CSS extraction never sees it.
    build.onResolve({ filter: /\.css\?inline$/ }, (args: { path: string; resolveDir: string }) => ({
      path: path.join(args.resolveDir, args.path),
      namespace: 'css-text',
    }));
    build.onLoad({ filter: /.*/, namespace: 'css-text' }, async (args: { path: string }) => {
      const { code } = await transform(await readFile(args.path.replace(/\?inline$/, ''), 'utf8'), { loader: 'css', minify: true });
      return { contents: code.trim(), loader: 'text' };
    });
  },
};

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: false,
  target: 'es2020',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildPlugins: [minifiedCss],
  banner: { js: "'use client';" },
  onSuccess: 'cp src/styles.css dist/styles.css',
});
