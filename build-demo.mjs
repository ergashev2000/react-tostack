// Builds a browser bundle for the demo page. React comes from the page's <script> tags.
import { build } from 'esbuild';

const globals = {
  name: 'globals',
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?$/ }, (a) => ({ path: a.path, namespace: 'g' }));
    b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => ({
      contents: `module.exports = window.${a.path === 'react' ? 'React' : 'ReactDOM'};`,
    }));
  },
};

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'Tostack',
  target: 'es2019',
  loader: { '.css': 'text' },
  plugins: [globals],
  outfile: 'demo/tostack.iife.js',
});
console.log('demo/tostack.iife.js built');
