export interface PlaylistVideo {
  id: string;
  titles: Record<string, string>;
  authors: Record<string, string>;
}

interface ExtractedPlaylistVideo {
  id: string;
  title: string;
  author: string;
}

function decodeYoutubeText(value: string) {
  return value.replace(/\\u0026/g, '&').trim();
}

function extractVideosFromHtml(html: string): ExtractedPlaylistVideo[] {
  const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
  if (!match) return [];

  const videos: ExtractedPlaylistVideo[] = [];

  try {
    const data = JSON.parse(match[1]);

    const findRenderers = (obj: unknown) => {
      if (!obj || typeof obj !== 'object') return;

      if ('playlistVideoRenderer' in obj) {
        const renderer = (obj as {
          playlistVideoRenderer?: {
            videoId?: string;
            title?: { runs?: { text?: string }[] };
            shortBylineText?: { runs?: { text?: string }[] };
          };
        }).playlistVideoRenderer;

        if (renderer?.videoId) {
          videos.push({
            id: renderer.videoId,
            title: renderer.title?.runs?.map((run) => run.text || '').join('') || 'Video',
            author: renderer.shortBylineText?.runs?.map((run) => run.text || '').join('') || 'Unknown Artist',
          });
        }
      }

      Object.values(obj).forEach(findRenderers);
    };

    findRenderers(data);
  } catch (error) {
    console.error('Error parsing ytInitialData', error);
  }

  return videos;
}

function mergeLocalizedVideos(
  primaryVideos: ExtractedPlaylistVideo[],
  localizedVideos: ExtractedPlaylistVideo[],
): PlaylistVideo[] {
  const localizedById = new Map(localizedVideos.map((video) => [video.id, video]));

  return primaryVideos.map((video) => {
    const localizedVideo = localizedById.get(video.id);

    return {
      id: video.id,
      titles: {
        en: decodeYoutubeText(video.title),
        ja: decodeYoutubeText(localizedVideo?.title ?? video.title),
      },
      authors: {
        en: decodeYoutubeText(video.author),
        ja: decodeYoutubeText(localizedVideo?.author ?? video.author),
      },
    };
  });
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

    return mergeLocalizedVideos(extractVideosFromHtml(htmlEn), extractVideosFromHtml(htmlJa));
  } catch (e) {
    console.error('Failed to fetch YouTube playlist', e);
  }
  return [];
}
