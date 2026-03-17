import { ui, defaultLang } from './ui';

export type AppLang = keyof typeof ui;

export function normalizeLang(lang?: string): AppLang {
  if (lang === 'ja' || lang === 'jp') return 'jp';
  return 'en';
}

export function getHtmlLang(lang: AppLang) {
  if (lang === 'jp') return 'ja';
  return 'en';
}

export function getLangFromUrl(url: URL): AppLang {
  const [, lang] = url.pathname.split('/');
  return normalizeLang(lang || defaultLang);
}

export function useTranslations(lang: AppLang) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
