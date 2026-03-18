import { normalizeLang, type AppLang } from '../i18n/utils';

export type AppView = 'links-view' | 'projects-view' | 'commission-view';
export type ActiveProjectRoute = 'pan' | 'dam-vision' | '';
export type ProjectRoute = 'software' | Exclude<ActiveProjectRoute, ''>;

const LANGUAGE_PREFIXES = new Set(['en', 'jp', 'ja']);

export function parseAppPath(pathname: string) {
  const segments = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  let routeLang: AppLang | null = null;

  if (LANGUAGE_PREFIXES.has(segments[0] ?? '')) {
    routeLang = normalizeLang(segments.shift());
  }

  let view: AppView = 'links-view';
  let projectRoute: ProjectRoute = 'software';

  if (segments[0] === 'software' || segments[0] === 'pan' || segments[0] === 'dam-vision') {
    view = 'projects-view';
    projectRoute = segments[0];
  } else if (segments[0] === 'commission') {
    view = 'commission-view';
  }

  const activeProjectRoute: ActiveProjectRoute =
    projectRoute === 'pan' || projectRoute === 'dam-vision' ? projectRoute : '';

  return { routeLang, view, projectRoute, activeProjectRoute };
}

export function buildAppPath(
  view: AppView,
  lang: AppLang | '' = '',
  projectRoute: ProjectRoute = 'software',
) {
  const prefix = lang ? `/${lang}` : '';
  const suffix =
    view === 'projects-view'
      ? `/${projectRoute}`
      : view === 'commission-view'
        ? '/commission'
        : '';

  return `${prefix}${suffix}` || '/';
}
