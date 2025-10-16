import { getRelativeLocaleUrl } from "astro:i18n";
import { ui, defaultLang, routes, type LanguageCode } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as LanguageCode;
  return defaultLang;
}

export function useTranslations(lang: LanguageCode) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: LanguageCode) {
  return function translatePath(path: string, l: LanguageCode = lang) {
    const pathName = path.replaceAll("/", "");
    const hasTranslation =
      defaultLang !== l &&
      routes[l] !== undefined &&
      routes[l][pathName] !== undefined;
    const translatedPath = hasTranslation ? routes[l][pathName] : path;

    return getRelativeLocaleUrl(l, translatedPath);
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split("/");
  const path = parts.pop() || parts.pop();

  if (path === undefined) {
    return undefined;
  }

  const currentLang = getLangFromUrl(url);

  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0];
    return route[path] !== undefined ? path : undefined;
  }

  const getKeyByValue = (
    obj: Record<string, string>,
    value: string,
  ): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], path);

  if (reversedKey !== undefined) {
    return reversedKey;
  }

  return undefined;
}
