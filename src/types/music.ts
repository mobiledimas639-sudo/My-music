export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl: string; // 30s high-quality audio preview from iTunes or fallback stream
  duration: number; // in seconds
  releaseDate?: string;
  genre?: string;
  youtubeQuery?: string;
  videoId?: string;
  source?: 'itunes' | 'innertube';
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverGradient: string;
  createdAt: number;
  updatedAt: number;
  tracks: Track[];
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  youtubeMode: boolean;
}

export type ActiveView = 
  | { type: 'home' }
  | { type: 'search'; query: string }
  | { type: 'liked' }
  | { type: 'playlists' }
  | { type: 'playlist'; playlistId: string }
  | { type: 'queue' };
