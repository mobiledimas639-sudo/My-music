import { Track } from '../types/music';
import { DEFAULT_FEATURED_TRACKS } from '../data/defaultCatalog';

interface ITunesTrackResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  releaseDate?: string;
  primaryGenreName?: string;
}

const memoryCache = new Map<string, Track[]>();
const videoIdCache = new Map<string, string>();

// Pre-fill cache with known featured video IDs
DEFAULT_FEATURED_TRACKS.forEach(track => {
  if (track.videoId) {
    const key = `${track.artist} - ${track.title}`.toLowerCase();
    videoIdCache.set(key, track.videoId);
    videoIdCache.set(track.id, track.videoId);
  }
});

/**
 * Normalizes iTunes API results into our Track schema
 */
export function formatITunesTrack(item: ITunesTrackResult): Track {
  const highResCover = item.artworkUrl100 
    ? item.artworkUrl100.replace(/100x100bb\.(jpg|png|webp)/, '600x600bb.jpg')
    : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

  const durationSec = item.trackTimeMillis 
    ? Math.round(item.trackTimeMillis / 1000) 
    : 180;

  const title = item.trackName || 'Lagu Tanpa Judul';
  const artist = item.artistName || 'Artis Tidak Diketahui';
  const cacheKey = `${artist} - ${title}`.toLowerCase();
  const knownVideoId = videoIdCache.get(cacheKey);

  return {
    id: `itunes-${item.trackId}`,
    title,
    artist,
    album: item.collectionName || 'Single / Album',
    coverUrl: highResCover,
    previewUrl: item.previewUrl || '',
    duration: durationSec,
    releaseDate: item.releaseDate ? item.releaseDate.split('T')[0] : undefined,
    genre: item.primaryGenreName || 'Music',
    youtubeQuery: `${artist} ${title} audio`,
    videoId: knownVideoId,
    source: 'itunes'
  };
}

/**
 * Resolves a full-length YouTube videoId for any track (eliminating 30-sec limit)
 */
export async function resolveTrackVideoId(track: Track): Promise<string | null> {
  if (track.videoId) return track.videoId;

  const cacheKey = `${track.artist} - ${track.title}`.toLowerCase();
  if (videoIdCache.has(cacheKey)) {
    const cachedId = videoIdCache.get(cacheKey)!;
    track.videoId = cachedId;
    return cachedId;
  }

  try {
    const query = track.youtubeQuery || `${track.artist} ${track.title} official audio`;
    const res = await fetch(`/api/music/search?query=${encodeURIComponent(query)}&limit=1`);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.results && data.results.length > 0 && data.results[0].videoId) {
      const vid = data.results[0].videoId;
      videoIdCache.set(cacheKey, vid);
      videoIdCache.set(track.id, vid);
      track.videoId = vid;
      if (data.results[0].durationSeconds && data.results[0].durationSeconds > 30) {
        track.duration = data.results[0].durationSeconds;
      }
      return vid;
    }
  } catch (err) {
    console.warn('Gagal meresolusi videoId YouTube untuk pemutaran penuh:', err);
  }
  return null;
}

/**
 * Searches music using MohammadKobirShah/InnerTube-API REST endpoint
 */
export async function searchInnerTubeMusic(query: string, limit: number = 30): Promise<Track[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const cacheKey = `innertube_${cleanQuery.toLowerCase()}_${limit}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  try {
    const res = await fetch(`/api/music/search?query=${encodeURIComponent(cleanQuery)}&limit=${limit}`);
    if (!res.ok) {
      throw new Error(`InnerTube-API status: ${res.status}`);
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    const tracks: Track[] = data.results.map((item: any) => {
      const track: Track = {
        id: `innertube-${item.videoId}`,
        videoId: item.videoId,
        title: item.title,
        artist: item.artist || 'YouTube Music',
        album: item.album || 'YouTube Single',
        coverUrl: item.coverUrl || item.thumbnail || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
        previewUrl: '', // Streamed in full via YouTube Player engine
        duration: item.durationSeconds || 180,
        genre: item.durationSeconds >= 1200 ? 'Non-Stop Mix' : 'YouTube Music',
        youtubeQuery: item.youtubeQuery || `${item.artist} ${item.title}`,
        source: 'innertube'
      };

      if (item.videoId) {
        videoIdCache.set(`${track.artist} - ${track.title}`.toLowerCase(), item.videoId);
        videoIdCache.set(track.id, item.videoId);
      }
      return track;
    });

    memoryCache.set(cacheKey, tracks);
    return tracks;
  } catch (err) {
    console.warn('Gagal memanggil InnerTube-API:', err);
    return [];
  }
}

/**
 * Searches music by seamlessly combining InnerTube API (full-length audio/mixes)
 * and global catalog (iTunes) in parallel for maximum depth and variety of songs.
 */
export async function searchTracks(
  query: string, 
  limit: number = 60
): Promise<Track[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const cacheKey = `unified_search_${cleanQuery.toLowerCase()}_${limit}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // 1. Fetch InnerTube and iTunes in parallel with generous limits
  const [innerTubePromise, iTunesPromise] = [
    searchInnerTubeMusic(cleanQuery, Math.max(limit, 40)),
    (async () => {
      try {
        const isIndo = /indonesia|tulus|mahalini|sheila|noah|raisa|tiara|pamungkas|dangdut|koplo/i.test(cleanQuery);
        const countryParam = isIndo ? '&country=ID' : '';
        const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&entity=song&limit=40${countryParam}`;
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) return [];
        const data = await response.json();
        if (!data.results || !Array.isArray(data.results)) return [];
        return data.results
          .filter((item: ITunesTrackResult) => item.trackName)
          .map(formatITunesTrack);
      } catch {
        return [];
      }
    })()
  ];

  const [innerTubeSettled, iTunesSettled] = await Promise.allSettled([innerTubePromise, iTunesPromise]);

  const innerTubeTracks: Track[] = innerTubeSettled.status === 'fulfilled' ? innerTubeSettled.value : [];
  const iTunesTracks: Track[] = iTunesSettled.status === 'fulfilled' ? iTunesSettled.value : [];

  // 2. Cross-reference: attach known videoIds from InnerTube to iTunes tracks
  const videoIdByTitleArtist = new Map<string, string>();
  for (const t of innerTubeTracks) {
    if (t.videoId) {
      const k = `${t.artist} - ${t.title}`.toLowerCase();
      videoIdByTitleArtist.set(k, t.videoId);
    }
  }

  for (const it of iTunesTracks) {
    const k = `${it.artist} - ${it.title}`.toLowerCase();
    if (videoIdByTitleArtist.has(k)) {
      it.videoId = videoIdByTitleArtist.get(k);
    }
  }

  // 3. Merge seamlessly, deduplicating so user gets a huge, varied collection
  const merged: Track[] = [];
  const seenKeys = new Set<string>();

  // Interleave results to provide both full mixes/videos and official tracks
  const maxLen = Math.max(innerTubeTracks.length, iTunesTracks.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < innerTubeTracks.length) {
      const t = innerTubeTracks[i];
      const key = `${t.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        merged.push(t);
      }
    }
    if (i < iTunesTracks.length) {
      const t = iTunesTracks[i];
      const key = `${t.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        merged.push(t);
      }
    }
  }

  // Fallback to remaining tracks if any
  for (const t of [...innerTubeTracks, ...iTunesTracks]) {
    if (!merged.some(m => m.id === t.id)) {
      merged.push(t);
    }
  }

  if (merged.length > 0) {
    memoryCache.set(cacheKey, merged);
  }

  return merged;
}

/**
 * Self-healing helper: Fetches a fresh previewUrl directly from iTunes API
 */
export async function refreshTrackPreview(track: Track): Promise<string | null> {
  try {
    const q = `${track.artist} ${track.title}`;
    const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=3`;
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const match = data.results.find((item: ITunesTrackResult) => item.previewUrl) || data.results[0];
      if (match && match.previewUrl) {
        return match.previewUrl;
      }
    }
  } catch (e) {
    console.warn('Gagal me-refresh preview URL:', e);
  }
  return null;
}

/**
 * Generates an embedded YouTube Search/Player URL using official videoId
 */
export function getYouTubeEmbedUrl(track: Track): string {
  if (track.videoId) {
    return `https://www.youtube-nocookie.com/embed/${track.videoId}?autoplay=1&enablejsapi=1`;
  }
  const query = encodeURIComponent(`${track.artist} - ${track.title} audio`);
  return `https://www.youtube-nocookie.com/embed?listType=search&list=${query}&autoplay=1`;
}

/**
 * Formats duration in seconds to MM:SS or HH:MM:SS string
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const totalSecs = Math.floor(seconds);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  if (hours > 0) {
    return `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
