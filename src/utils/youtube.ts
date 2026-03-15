export async function getLatestVideo(playlistId: string): Promise<{ id: string, titles: Record<string, string> } | null> {
  try {
    const url = `https://www.youtube.com/playlist?list=${playlistId}`;
    
    const [resEn, resJa] = await Promise.all([
      fetch(url, { headers: { 'Accept-Language': 'en-US,en;q=0.9' } }),
      fetch(url, { headers: { 'Accept-Language': 'ja-JP,ja;q=0.9' } })
    ]);

    if (!resEn.ok || !resJa.ok) return null;
    
    const htmlEn = await resEn.text();
    const htmlJa = await resJa.text();
    
    const idMatch = htmlEn.match(/"videoId":"([^"]+)"/);
    if (!idMatch) return null;
    const id = idMatch[1];

    const titleMatchEn = htmlEn.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
    const titleMatchJa = htmlJa.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);

    return {
      id,
      titles: {
        en: titleMatchEn ? titleMatchEn[1].replace(/\\u0026/g, '&') : 'Latest Video',
        ja: titleMatchJa ? titleMatchJa[1].replace(/\\u0026/g, '&') : 'Latest Video'
      }
    };
  } catch (e) {
    console.error('Failed to fetch YouTube playlist', e);
  }
  return null;
}
