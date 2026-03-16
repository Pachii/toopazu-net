let cachedTopazPanVersion: string | null = null;

async function fetchJson(url: string) {
  const response = await fetch(url, {
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

  try {
    const latestRelease = await fetchJson('https://api.github.com/repos/Pachii/topaz-pan/releases/latest');
    if (latestRelease?.tag_name) {
      cachedTopazPanVersion = latestRelease.tag_name;
      return cachedTopazPanVersion;
    }
  } catch {}

  try {
    const tags = await fetchJson('https://api.github.com/repos/Pachii/topaz-pan/tags?per_page=1');
    if (Array.isArray(tags) && tags[0]?.name) {
      cachedTopazPanVersion = tags[0].name;
      return cachedTopazPanVersion;
    }
  } catch {}

  cachedTopazPanVersion = 'v0.1.0-alpha';
  return cachedTopazPanVersion;
}
