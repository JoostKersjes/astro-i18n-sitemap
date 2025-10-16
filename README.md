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
