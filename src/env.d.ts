/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  setLanguage?: (lang: string, animate?: boolean) => void;
  switchLanguageRoute?: (lang: string) => void;
  translations?: Record<string, Record<string, string>>;
}
