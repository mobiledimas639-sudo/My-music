import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory TTL Cache (matching cache_service.py from MohammadKobirShah/InnerTube-API)
interface CacheEntry {
  data: any;
  expiresAt: number;
}
const cacheStore = new Map<string, CacheEntry>();

function getCache(key: string): any | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any, ttlSeconds: number = 300) {
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}

// InnerTube Client Configuration (matching config.py from MohammadKobirShah/InnerTube-API)
const INNERTUBE_CLIENTS = {
  WEB: {
    clientName: 'WEB',
    clientVersion: '2.20240101.01.00',
    hl: 'id',
    gl: 'ID'
  },
  WEB_REMIX: {
    clientName: 'WEB_REMIX',
    clientVersion: '1.20240101.01.00',
    hl: 'id',
    gl: 'ID'
  },
  ANDROID: {
    clientName: 'ANDROID',
    clientVersion: '19.09.37',
    hl: 'id',
    gl: 'ID'
  }
};

/**
 * YouTube Search Parser (matching parser.py in MohammadKobirShah/InnerTube-API)
 */
function parseVideoRenderer(renderer: any) {
  const videoId = renderer.videoId || '';
  const title = (renderer.title?.runs || []).map((r: any) => r.text).join('') || renderer.title?.simpleText || '';
  const author = (renderer.ownerText?.runs || []).map((r: any) => r.text).join('') || '';
  
  const lengthText = renderer.lengthText?.simpleText || '';
  let durationSeconds = 180;
  if (lengthText) {
    const parts = lengthText.split(/[:.]/).map(Number);
    if (parts.length === 2) {
      durationSeconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  const thumbnails = renderer.thumbnail?.thumbnails || [];
  const thumbnail = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : '';

  return {
    videoId,
    title,
    artist: author || 'YouTube Music',
    album: 'YouTube Single',
    durationText: lengthText || '3:30',
    durationSeconds,
    thumbnail,
    coverUrl: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    previewUrl: '', // InnerTube tracks stream via YouTube Embed Player
    youtubeQuery: `${author} ${title}`,
    isInnerTube: true
  };
}

/**
 * Route: GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    engine: 'InnerTube API Wrapper',
    repository: 'https://github.com/MohammadKobirShah/InnerTube-API.git',
    version: '1.0.0',
    clients: Object.keys(INNERTUBE_CLIENTS),
    timestamp: new Date().toISOString()
  });
});

/**
 * Route: GET /api/music/search
 * YouTube Music & YouTube search using InnerTube Protocol
 */
app.get('/api/music/search', async (req, res) => {
  const query = (req.query.query as string || '').trim();
  const limit = Math.min(80, Math.max(1, Number(req.query.limit) || 40));

  if (!query) {
    return res.status(400).json({ success: false, detail: 'Query parameter is required' });
  }

  const cacheKey = `innertube_music_search_${query.toLowerCase()}_${limit}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    // Search target: preserve user's exact intent (e.g. "jj tiktok", "tulus", "coldplay")
    const searchTarget = /lagu|music|audio|remix|dj|song|soundtrack|beat|lofi|mix/i.test(query)
      ? query
      : `${query} audio`;

    // 1. Search via InnerTube WEB client
    const response = await fetch('https://www.youtube.com/youtubei/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        context: {
          client: INNERTUBE_CLIENTS.WEB
        },
        query: searchTarget
      })
    });

    if (!response.ok) {
      throw new Error(`InnerTube request failed with status: ${response.status}`);
    }

    const data: any = await response.json();
    const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
    
    const results: any[] = [];
    const seenVideoIds = new Set<string>();

    for (const c of contents) {
      const items = c.itemSectionRenderer?.contents || [];
      for (const item of items) {
        let vRenderer = item.videoRenderer || item.compactVideoRenderer;
        if (vRenderer && vRenderer.videoId && !seenVideoIds.has(vRenderer.videoId)) {
          seenVideoIds.add(vRenderer.videoId);
          results.push(parseVideoRenderer(vRenderer));
        } else if (item.shelfRenderer?.content?.verticalListRenderer?.items) {
          for (const subItem of item.shelfRenderer.content.verticalListRenderer.items) {
            const subRenderer = subItem.videoRenderer || subItem.compactVideoRenderer;
            if (subRenderer && subRenderer.videoId && !seenVideoIds.has(subRenderer.videoId)) {
              seenVideoIds.add(subRenderer.videoId);
              results.push(parseVideoRenderer(subRenderer));
            }
          }
        }
        if (results.length >= limit) break;
      }
      if (results.length >= limit) break;
    }

    const payload = {
      success: true,
      query,
      count: results.length,
      engine: 'InnerTube-API',
      results
    };

    setCache(cacheKey, payload, 300); // 5 min TTL
    res.json(payload);
  } catch (error: any) {
    console.error('InnerTube search error:', error);
    res.status(500).json({
      success: false,
      detail: `Music search failed: ${error.message}`
    });
  }
});

/**
 * Route: GET /api/innertube/player/:videoId
 * Fetches video metadata and playability data
 */
app.get('/api/innertube/player/:videoId', async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    return res.status(400).json({ success: false, detail: 'Video ID is required' });
  }

  const cacheKey = `innertube_player_${videoId}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await fetch('https://www.youtube.com/youtubei/v1/player', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        context: {
          client: INNERTUBE_CLIENTS.WEB
        },
        videoId
      })
    });

    const data: any = await response.json();
    const payload = {
      success: true,
      videoId,
      title: data.videoDetails?.title || '',
      author: data.videoDetails?.author || '',
      durationSeconds: Number(data.videoDetails?.lengthSeconds) || 0,
      playabilityStatus: data.playabilityStatus || {},
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`
    };

    setCache(cacheKey, payload, 600); // 10 min TTL
    res.json(payload);
  } catch (err: any) {
    res.status(500).json({ success: false, detail: `Player fetch failed: ${err.message}` });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Aurora Sound with InnerTube API running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
