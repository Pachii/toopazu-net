export interface PlaylistVideo {
  id: string;
  titles: Record<string, string>;
  authors: Record<string, string>;
}

function decodeYoutubeText(value: string) {
  return value.replace(/\\u0026/g, '&').trim();
}

export async function getPlaylistVideos(playlistId: string): Promise<PlaylistVideo[]> {
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
      
      const videos: { id: string; title: string; author: string }[] = [];
      try {
        const data = JSON.parse(match[1]);
        
        const findRenderers = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (obj.playlistVideoRenderer) {
            const r = obj.playlistVideoRenderer;
            videos.push({
              id: r.videoId,
              title: r.title?.runs?.map((run: { text?: string }) => run.text || '').join('') || 'Video',
              author: r.shortBylineText?.runs?.map((run: { text?: string }) => run.text || '').join('') || 'Unknown Artist',
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
        en: decodeYoutubeText(v.title),
        ja: videosJa[i] ? decodeYoutubeText(videosJa[i].title) : decodeYoutubeText(v.title)
      },
      authors: {
        en: decodeYoutubeText(v.author),
        ja: videosJa[i] ? decodeYoutubeText(videosJa[i].author) : decodeYoutubeText(v.author)
      }
    }));
  } catch (e) {
    console.error('Failed to fetch YouTube playlist', e);
  }
  return [];
}
