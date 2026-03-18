import { buildAppPath, parseAppPath, type ActiveProjectRoute } from '../utils/appRoutes';

interface ProjectPanel {
  root: HTMLElement;
  stack: HTMLElement;
  shell: HTMLElement;
  compact: HTMLElement;
  openButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;
  route: Exclude<ActiveProjectRoute, ''>;
  closeEventName: string;
  closeTimer: number;
  stackResetTimer: number;
  hasSynced: boolean;
}

const PANEL_SELECTOR = '[data-project-panel]';
const STACK_SELECTOR = '[data-project-stack]';
const CLOSE_DURATION_MS = 620;
const STACK_REVEAL_DELAY_MS = 180;
const STACK_RETURN_SETTLE_MS = 920;
const stackPhaseTimers = new WeakMap<HTMLElement, number>();

const isActiveProjectRoute = (value?: string | null): value is Exclude<ActiveProjectRoute, ''> =>
  value === 'pan' || value === 'dam-vision';

function setStackPhase(stack: HTMLElement, phase?: string) {
  const phaseTimer = stackPhaseTimers.get(stack);
  if (typeof phaseTimer === 'number') {
    window.clearTimeout(phaseTimer);
    stackPhaseTimers.delete(stack);
  }

  if (phase) {
    stack.dataset.stackPhase = phase;
  } else {
    delete stack.dataset.stackPhase;
  }
}

function settleStackPhase(stack: HTMLElement, delay: number) {
  const phaseTimer = stackPhaseTimers.get(stack);
  if (typeof phaseTimer === 'number') {
    window.clearTimeout(phaseTimer);
  }

  const nextTimer = window.setTimeout(() => {
    delete stack.dataset.stackPhase;
    stackPhaseTimers.delete(stack);
  }, delay);

  stackPhaseTimers.set(stack, nextTimer);
}

export function syncProjectsViewState(
  rootOrStack: HTMLElement | null,
  preferredRoute: ActiveProjectRoute | null = null,
): ActiveProjectRoute {
  if (!rootOrStack) return '';

  const stack = rootOrStack.matches(STACK_SELECTOR)
    ? rootOrStack
    : rootOrStack.closest<HTMLElement>(STACK_SELECTOR);

  if (!(stack instanceof HTMLElement)) return '';

  const panels = Array.from(stack.querySelectorAll<HTMLElement>(PANEL_SELECTOR));
  const openShell = stack.querySelector<HTMLElement>('[data-project-shell].is-open');
  const fallbackRoute = openShell?.closest<HTMLElement>(PANEL_SELECTOR)?.dataset.projectRoute ?? '';
  const activeRoute =
    preferredRoute !== null
      ? preferredRoute
      : isActiveProjectRoute(stack.dataset.activeProject)
        ? stack.dataset.activeProject
        : isActiveProjectRoute(fallbackRoute)
          ? fallbackRoute
          : '';
  const activeIndex = panels.findIndex((panel) => panel.dataset.projectRoute === activeRoute);
  const hasOpenProject = Boolean(activeRoute);

  if (activeRoute) {
    stack.dataset.activeProject = activeRoute;
  } else {
    delete stack.dataset.activeProject;
  }

  stack.dataset.stackMode = hasOpenProject ? 'focused' : 'list';

  panels.forEach((panel, index) => {
    const isFocused = hasOpenProject && panel.dataset.projectRoute === activeRoute;
    const isHidden = hasOpenProject && !isFocused;
    const relation =
      activeIndex === -1
        ? 'idle'
        : index < activeIndex
          ? 'before'
          : index > activeIndex
            ? 'after'
            : 'active';

    panel.classList.toggle('is-focused-project', isFocused);
    panel.classList.toggle('is-hidden-project', isHidden);
    panel.dataset.projectRelation = relation;
    panel.setAttribute('aria-hidden', isHidden ? 'true' : 'false');

    if ('inert' in panel) {
      (panel as HTMLElement & { inert: boolean }).inert = isHidden;
    }
  });

  return activeRoute;
}

function dispatchProjectClose(panel: ProjectPanel) {
  if (!panel.closeEventName) return;
  document.dispatchEvent(new CustomEvent(panel.closeEventName));
}

function syncCompactHeight(panel: ProjectPanel) {
  panel.shell.style.setProperty('--project-compact-height', `${panel.compact.getBoundingClientRect().height}px`);
}

function setPanelOpen(
  panel: ProjectPanel,
  open: boolean,
  pushHistory = false,
  immediate = false,
  activeRoute: ActiveProjectRoute | null = open ? panel.route : null,
) {
  window.clearTimeout(panel.closeTimer);
  window.clearTimeout(panel.stackResetTimer);
  const wasOpen = panel.shell.classList.contains('is-open') || panel.shell.classList.contains('is-closing');

  if (open) {
    setStackPhase(panel.stack);
    panel.shell.classList.remove('is-closing');
    panel.shell.classList.add('is-open');
  } else if (immediate) {
    if (wasOpen && activeRoute !== '') {
      setStackPhase(panel.stack);
    }
    if (wasOpen) {
      dispatchProjectClose(panel);
    }
    panel.shell.classList.remove('is-open');
    panel.shell.classList.remove('is-closing');
  } else {
    if (activeRoute === '') {
      setStackPhase(panel.stack, 'returning');
      settleStackPhase(panel.stack, STACK_RETURN_SETTLE_MS);
    } else {
      setStackPhase(panel.stack);
    }

    if (wasOpen) {
      dispatchProjectClose(panel);
    }
    panel.shell.classList.toggle('is-closing', wasOpen);
    panel.shell.classList.remove('is-open');
    if (wasOpen) {
      panel.closeTimer = window.setTimeout(() => {
        panel.shell.classList.remove('is-closing');
      }, CLOSE_DURATION_MS);
    }
  }

  panel.openButton.setAttribute('aria-expanded', open ? 'true' : 'false');

  if (!open && !immediate && activeRoute === '') {
    panel.stackResetTimer = window.setTimeout(() => {
      syncProjectsViewState(panel.stack, '');
    }, STACK_REVEAL_DELAY_MS);
  } else if (activeRoute === null) {
    syncProjectsViewState(panel.stack);
  } else {
    syncProjectsViewState(panel.stack, activeRoute);
  }

  if (pushHistory) {
    const { routeLang } = parseAppPath(window.location.pathname);
    const nextPath = buildAppPath('projects-view', routeLang ?? '', open ? panel.route : 'software');

    if (window.location.pathname !== nextPath) {
      window.history.pushState({ projectRoute: open ? panel.route : 'software' }, '', nextPath);
    }
  }
}

function createPanel(root: HTMLElement, stack: HTMLElement): ProjectPanel | null {
  const route = root.dataset.projectRoute;
  const shell = root.querySelector<HTMLElement>('[data-project-shell]');
  const compact = root.querySelector<HTMLElement>('[data-project-compact]');
  const openButton = root.querySelector<HTMLButtonElement>('[data-project-open]');
  const closeButton = root.querySelector<HTMLButtonElement>('[data-project-close]');

  if (!isActiveProjectRoute(route) || !shell || !compact || !openButton || !closeButton) {
    return null;
  }

  const panel: ProjectPanel = {
    root,
    stack,
    shell,
    compact,
    openButton,
    closeButton,
    route,
    closeEventName: root.dataset.projectCloseEvent ?? '',
    closeTimer: 0,
    stackResetTimer: 0,
    hasSynced: false,
  };

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => syncCompactHeight(panel));
    observer.observe(compact);
  } else {
    window.addEventListener('resize', () => syncCompactHeight(panel));
  }

  syncCompactHeight(panel);
  return panel;
}

function setupProjectStack(stack: HTMLElement) {
  if (stack.dataset.projectStackReady === 'true') return;
  stack.dataset.projectStackReady = 'true';

  const panels = Array.from(stack.querySelectorAll<HTMLElement>(PANEL_SELECTOR))
    .map((root) => createPanel(root, stack))
    .filter((panel): panel is ProjectPanel => panel !== null);

  if (!panels.length) return;

  const syncWithLocation = (nextPath = window.location.pathname) => {
    const { activeProjectRoute } = parseAppPath(nextPath);
    const currentOpenRoute =
      panels.find((panel) => panel.shell.classList.contains('is-open') || panel.shell.classList.contains('is-closing'))
        ?.route ?? '';

    panels.forEach((panel) => {
      const shouldOpen = panel.route === activeProjectRoute;
      const shouldAnimateClose = Boolean(currentOpenRoute) && currentOpenRoute !== activeProjectRoute && panel.route === currentOpenRoute;
      const shouldImmediateClose = !shouldOpen && !shouldAnimateClose;
      const nextActiveRoute = shouldOpen || shouldAnimateClose ? activeProjectRoute : null;

      setPanelOpen(
        panel,
        shouldOpen,
        false,
        !panel.hasSynced || shouldImmediateClose,
        nextActiveRoute,
      );
      panel.hasSynced = true;
    });
  };

  const handleAppRouteChange = (event: Event) => {
    const nextPath = (event as CustomEvent<{ pathname?: string }>).detail?.pathname || window.location.pathname;
    syncWithLocation(nextPath);
  };

  panels.forEach((panel) => {
    panel.openButton.addEventListener('click', () => {
      syncProjectsViewState(stack, panel.route);

      panels.forEach((otherPanel) => {
        if (otherPanel !== panel) {
          setPanelOpen(otherPanel, false, false, true, panel.route);
        }
      });

      window.requestAnimationFrame(() => {
        setPanelOpen(panel, true, true, false, panel.route);
      });
    });

    panel.closeButton.addEventListener('click', () => {
      setPanelOpen(panel, false, true, false, '');
    });
  });

  document.addEventListener('app-route-change', handleAppRouteChange);
  syncWithLocation();
}

export function setupProjectPanels() {
  document.querySelectorAll<HTMLElement>(STACK_SELECTOR).forEach((stack) => {
    setupProjectStack(stack);
  });
}
