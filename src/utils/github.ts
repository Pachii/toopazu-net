import { topazPanBundledVersion } from '../data/topazPan';

let cachedTopazPanVersion: string | null = null;

function getTagNameFromUrl(url: string) {
  try {
    const { pathname } = new URL(url);
    const segments = pathname.split('/').filter(Boolean);
    const tagIndex = segments.indexOf('tag');
    return tagIndex >= 0 ? segments[tagIndex + 1] ?? null : null;
  } catch {
    return null;
  }
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'toopazu-net-build',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getTopazPanVersion() {
  if (cachedTopazPanVersion) return cachedTopazPanVersion;
  let lastError: unknown = null;

  try {
    const latestReleasePage = await fetch('https://github.com/Pachii/topaz-pan/releases/latest', {
      cache: 'no-store',
      redirect: 'follow',
      headers: {
        'User-Agent': 'toopazu-net-build',
      },
    });
    const redirectedTag = getTagNameFromUrl(latestReleasePage.url);
    if (redirectedTag) {
      cachedTopazPanVersion = redirectedTag;
      return cachedTopazPanVersion;
    }
  } catch (error) {
    lastError = error;
  }

  try {
    const latestRelease = await fetchJson('https://api.github.com/repos/Pachii/topaz-pan/releases/latest');
    if (latestRelease?.tag_name) {
      cachedTopazPanVersion = latestRelease.tag_name;
      return cachedTopazPanVersion;
    }
  } catch (error) {
    lastError = error;
  }

  try {
    const tags = await fetchJson('https://api.github.com/repos/Pachii/topaz-pan/tags?per_page=1');
    if (Array.isArray(tags) && tags[0]?.name) {
      cachedTopazPanVersion = tags[0].name;
      return cachedTopazPanVersion;
    }
  } catch (error) {
    lastError = error;
  }

  if (lastError) {
    console.warn('Falling back to bundled topaz pan version.', lastError);
  }
  cachedTopazPanVersion = topazPanBundledVersion;
  return cachedTopazPanVersion;
}
