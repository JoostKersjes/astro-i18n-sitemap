export const languages = {
  en: "English",
  es: "Español",
  "pt-br": "Português (Brasil)",
};

export const ui = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.pizza": "Pizza",
  },
  es: {
    "nav.home": "Hogar",
    "nav.about": "Acerca de",
    "nav.pizza": "Pizza",
  },
  "pt-br": {
    "nav.home": "Lar",
    "nav.about": "Sobre",
    "nav.pizza": "Pizza",
  },
} as const;

export type LanguageCode = keyof typeof ui;

export const defaultLang = "en" as const satisfies LanguageCode;

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
