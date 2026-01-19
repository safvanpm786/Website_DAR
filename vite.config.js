import { defineConfig } from 'vite';

export default defineConfig({
    // Base public path for the application
    base: '/Website_DAR/',

    // Build specific options
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },

    // Dev server options
    server: {
        port: 3000,
        open: true
    }
});
