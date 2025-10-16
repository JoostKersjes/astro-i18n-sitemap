// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  trailingSlash: "always",

  i18n: {
    locales: ["es", "en", "pt-br"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          es: "es-ES",
          "pt-br": "pt-BR",
        },
      },
    }),
  ],
});
