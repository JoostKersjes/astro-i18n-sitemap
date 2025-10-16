// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { getRoutesAsSitemapLinks } from "./src/i18n/ui";

const site = "https://example.com";
const locales = {
  en: "en-US",
  es: "es-ES",
  "pt-br": "pt-BR",
};
const defaultLocale = "en";

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: "always",

  i18n: {
    locales: Object.keys(locales),
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales,
      },
      serialize(item) {
        const linksForTranslatedRoutes = getRoutesAsSitemapLinks(site, locales);

        for (const links of linksForTranslatedRoutes) {
          if (links.some((link) => link.url === item.url)) {
            item.links = links;
            break;
          }
        }
        return item;
      },
    }),
  ],
});
