# astro-i18n-sitemap

This project has 3 pages:

- Home
- About
- Pizza

Additionally, it has 3 languages (`en`, `es` and `pt-br`) and it uses translated routes:

```
src/pages
├── about.astro
├── es
│   ├── acerca-de.astro
│   ├── index.astro
│   └── pizza.astro
├── index.astro
├── pizza.astro
└── pt-BR
    ├── index.astro
    ├── pizza.astro
    └── sobre.astro
```

## The Problem

Translated routes are defined in [`src/i18n/ui.ts`](./src/i18n/ui.ts).

Astro generates the sitemap. Both 'Home' and 'Pizza' appear in the sitemap with
correct `alternate`s for every language because the file names are the same.

The 'About' page is shown in the sitemap as 3 separate pages with no `alternate`s.

Preview of `dist/sitemap-0.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://example.com/</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/" />
    <xhtml:link rel="alternate" hreflang="es-ES" href="https://example.com/es/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR/" />
  </url>
  <url>
    <loc>https://example.com/about/</loc>
  </url>
  <url>
    <loc>https://example.com/es/</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/" />
    <xhtml:link rel="alternate" hreflang="es-ES" href="https://example.com/es/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR/" />
  </url>
  <url>
    <loc>https://example.com/es/acerca-de/</loc>
  </url>
  <url>
    <loc>https://example.com/es/pizza/</loc>
    <xhtml:link rel="alternate" hreflang="es-ES" href="https://example.com/es/pizza/" />
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/pizza/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR/pizza/" />
  </url>
  <url>
    <loc>https://example.com/pizza/</loc>
    <xhtml:link rel="alternate" hreflang="es-ES" href="https://example.com/es/pizza/" />
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/pizza/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR/pizza/" />
  </url>
  <url>
    <loc>https://example.com/pt-BR/</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/" />
    <xhtml:link rel="alternate" hreflang="es-ES" href="https://example.com/es/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR/" />
  </url>
  <url>
    <loc>https://example.com/pt-BR/pizza/</loc>
    <xhtml:link rel="alternate" hreflang="es-ES" href="https://example.com/es/pizza/" />
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/pizza/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR/pizza/" />
  </url>
  <url>
    <loc>https://example.com/pt-BR/sobre/</loc>
  </url>
</urlset>
```

## The workaround

There is a workaround for this problem using the `serialize` option:

```js
      serialize(item) {
        const linksForTranslatedRoutes = [
          [
            { url: "https://example.com/about/", lang: "en-US" },
            { url: "https://example.com/es/acerca-de/", lang: "es-ES" },
            { url: "https://example.com/pt-br/sobre/", lang: "pt-BR" },
          ],
          [
            // ...
          ]
        ];
        for (const links of linksForTranslatedRoutes) {
          if (links.some((link) => link.url === item.url)) {
            item.links = links;
            break;
          }
        }
        return item;
      },
```

Or if you don't want to maintain a list of translated routes in two places:

```typescript
// src/i18n/ui.ts
export const routes: Record<
  Exclude<LanguageCode, typeof defaultLang>,
  Record<string, string>
> = {
  es: {
    about: "acerca-de",
    pizza: "pizza",
  },
  "pt-br": {
    about: "sobre",
    pizza: "pizza",
  },
};

export const getRoutesAsSitemapLinks = (
  site: string,
  locales: Record<LanguageCode, string>,
) => {
  const keys = Object.keys(Object.values(routes)[0]);

  return keys.map((key) => {
    const base = { lang: locales[defaultLang], url: `${site}/${key}/` };

    const others = Object.entries(routes).map(([lang, routeMap]) => ({
      lang: locales[lang as LanguageCode],
      url: `${site}/${lang}/${routeMap[key]}/`,
    }));

    return [base, ...others].toSorted((a, b) => a.url.localeCompare(b.url));
  });
};
```

```js
// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
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
```
