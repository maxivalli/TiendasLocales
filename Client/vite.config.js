import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "firebase-messaging-sw.js",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "all-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 2,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      includeAssets: [
        "favicon.ico",
        "apple-touc-icon.png",
        "maskable_icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
      ],
      manifest: {
        name: "Tiendas Locales",
        short_name: "Tiendas Locales",
        description: "¡Comprá en tu ciudad!",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
          {
            src: "/maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],

        shortcuts: [
          {
            name: "Agregar",
            description: "Agregar un producto",
            url: "https://tiendaslocales.com.ar/#/agregarproducto",
            icons: [
              {
                src: "add.png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "Mensajes",
            description: "Mis mensajes",
            url: "https://tiendaslocales.com.ar/#/mensajes",
            icons: [
              {
                src: "user.png",
                sizes: "192x192",
              },
            ],
          },
        ],

        theme_color: "#ff0000",
        background_color: "#ff0000",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
      },
    }),
  ],
  base: "",
  build: {
    chunkSizeWarningLimit: 1000000,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
