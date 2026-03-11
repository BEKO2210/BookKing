import { defineConfig } from 'vite';
import path from 'node:path';
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/BookMeWidget.tsx'),
            name: 'BookMeWidget',
            formats: ['iife'],
            fileName: () => 'book-me-widget.js',
        },
        outDir: path.resolve(__dirname, '../public/widget'),
        emptyOutDir: false,
        target: 'ES2020',
        minify: true,
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
        },
    },
});
