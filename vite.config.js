import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Base public path for the application
    base: './',

    // Build specific options
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                cart: resolve(__dirname, 'cart.html'),
                collections: resolve(__dirname, 'collections.html'),
                contact: resolve(__dirname, 'contact.html'),
                perfume: resolve(__dirname, 'perfume.html'),
                shipping: resolve(__dirname, 'shipping.html'),
                payment: resolve(__dirname, 'payment.html'),
                'payment-success': resolve(__dirname, 'payment-success.html'),
                'payment-failed': resolve(__dirname, 'payment-failed.html'),
            },
        },
    },

    // Dev server options
    server: {
        port: 3000,
        open: true
    }
});
