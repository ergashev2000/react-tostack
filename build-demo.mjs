// Builds a browser bundle for the demo page. React comes from the page's <script> tags.
import { build, transform } from 'esbuild';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const globals = {
  name: 'globals',
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?(\/jsx-runtime)?$/ }, (a) => ({ path: a.path, namespace: 'g' }));
    b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => ({
      contents:
        a.path === 'react/jsx-runtime'
          ? // The UMD build has no jsx-runtime; map it onto createElement.
            `const R = window.React;
             const jsx = (type, props, key) => R.createElement(type, key === undefined ? props : { ...props, key });
             module.exports = { jsx, jsxs: jsx, Fragment: R.Fragment };`
          : `module.exports = window.${a.path === 'react' ? 'React' : 'ReactDOM'};`,
    }));
  },
};

const minifiedCss = {
  name: 'minified-css-text',
  setup(b) {
    b.onResolve({ filter: /\.css\?inline$/ }, (a) => ({
      path: path.join(a.resolveDir, a.path),
      namespace: 'css-text',
    }));
    b.onLoad({ filter: /.*/, namespace: 'css-text' }, async (args) => {
      const { code } = await transform(await readFile(args.path.replace(/\?inline$/, ''), 'utf8'), { loader: 'css', minify: true });
      return { contents: code.trim(), loader: 'text' };
    });
  },
};

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'Tostack',
  target: 'es2020',
  jsx: 'automatic',
  plugins: [globals, minifiedCss],
  outfile: 'demo/tostack.iife.js',
});
console.log('demo/tostack.iife.js built');
