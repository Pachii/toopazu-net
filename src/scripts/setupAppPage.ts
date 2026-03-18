import { getHtmlLang, normalizeLang } from '../i18n/utils';
import { buildAppPath, parseAppPath } from '../utils/appRoutes';
import { setupProjectPanels } from './projectPanels';

interface AppPageState {
  forcedLang?: string | null;
  translations: Record<string, Record<string, string>>;
}

let appPageReady = false;

function readAppPageState() {
  const stateEl = document.querySelector<HTMLScriptElement>('[data-app-page-state]');
  if (!stateEl?.textContent) return null;

  try {
    return JSON.parse(stateEl.textContent) as AppPageState;
  } catch (error) {
    console.error('Failed to parse app page state', error);
    return null;
  }
}

function getInitialLanguage(forcedLang?: string | null) {
  const { routeLang } = parseAppPath(window.location.pathname);
  let lang = forcedLang || routeLang || localStorage.getItem('preferred-language');

  if (!lang) {
    const browserLang = navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage || '';
    lang = browserLang.split('-')[0].toLowerCase();
  }

  return normalizeLang(lang);
}

export function setupAppPage() {
  if (appPageReady) return;

  const state = readAppPageState();
  if (!state) return;

  appPageReady = true;
  const { translations, forcedLang = null } = state;

  window.translations = translations;
  const initialLanguage = getInitialLanguage(forcedLang);
  document.documentElement.lang = getHtmlLang(initialLanguage);

  window.setLanguage = (nextLang, animate = true) => {
    const lang = normalizeLang(nextLang);
    if (!translations[lang]) return;

    localStorage.setItem('preferred-language', lang);
    const targetEls = document.querySelectorAll<HTMLElement>('[data-i18n], .commission-card');

    const applyLanguage = () => {
      document.documentElement.lang = getHtmlLang(lang);

      document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (key && translations[lang]?.[key]) {
          el.textContent = translations[lang][key];
        }
      });

      document.querySelectorAll<HTMLElement>('.lang-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

      document.dispatchEvent(new CustomEvent('app-language-change', { detail: { lang } }));
    };

    if (!animate) {
      applyLanguage();
      return;
    }

    targetEls.forEach((el) => {
      el.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out, filter 0.15s ease-out';
      el.style.opacity = '0';
      el.style.transform = 'translateY(4px)';
      el.style.filter = 'blur(2px)';
    });

    window.setTimeout(() => {
      applyLanguage();

      targetEls.forEach((el) => {
        el.style.transition = 'none';
        el.style.transform = 'translateY(-4px)';
        void el.offsetWidth;
        el.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out, filter 0.15s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.filter = 'blur(0px)';
      });
    }, 150);
  };

  window.switchLanguageRoute = (nextLang) => {
    const lang = normalizeLang(nextLang);
    const { view, projectRoute } = parseAppPath(window.location.pathname);

    localStorage.setItem('preferred-language', lang);
    window.location.pathname = buildAppPath(view, lang, projectRoute);
  };

  const initialize = () => {
    window.setLanguage?.(initialLanguage, false);
    setupProjectPanels();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}
