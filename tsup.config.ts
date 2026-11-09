import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  target: 'es2019',
  external: ['react', 'react-dom'],
  loader: { '.css': 'text' },
  banner: { js: "'use client';" },
  onSuccess: 'cp src/styles.css dist/styles.css',
});
