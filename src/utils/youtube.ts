export async function getPlaylistVideos(playlistId: string): Promise<{ id: string, titles: Record<string, string> }[]> {
  try {
    const url = `https://www.youtube.com/playlist?list=${playlistId}`;
    
    const [resEn, resJa] = await Promise.all([
      fetch(url, { headers: { 'Accept-Language': 'en-US,en;q=0.9' } }),
      fetch(url, { headers: { 'Accept-Language': 'ja-JP,ja;q=0.9' } })
    ]);

    if (!resEn.ok || !resJa.ok) return [];
    
    const htmlEn = await resEn.text();
    const htmlJa = await resJa.text();
    
    const extractVideos = (html: string) => {
      const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
      if (!match) return [];
      
      const videos: {id: string, title: string}[] = [];
      try {
        const data = JSON.parse(match[1]);
        
        const findRenderers = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (obj.playlistVideoRenderer) {
            const r = obj.playlistVideoRenderer;
            videos.push({
              id: r.videoId,
              title: r.title?.runs?.[0]?.text || 'Video'
            });
          }
          for (const key of Object.keys(obj)) {
            findRenderers(obj[key]);
          }
        };
        findRenderers(data);
      } catch (e) {
        console.error('Error parsing ytInitialData', e);
      }
      return videos;
    };

    const videosEn = extractVideos(htmlEn);
    const videosJa = extractVideos(htmlJa);
    
    // Zip them together
    return videosEn.map((v, i) => ({
      id: v.id,
      titles: {
        en: v.title.replace(/\\u0026/g, '&'),
        ja: videosJa[i] ? videosJa[i].title.replace(/\\u0026/g, '&') : v.title.replace(/\\u0026/g, '&')
      }
    }));
  } catch (e) {
    console.error('Failed to fetch YouTube playlist', e);
  }
  return [];
}
