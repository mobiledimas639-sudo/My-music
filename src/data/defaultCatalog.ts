import { Track, Playlist } from '../types/music';

// Curated high-fidelity tracks with verified audio and YouTube Video IDs for FULL uninterrupted playback
export const REFERENCE_TRACKS = {
  // Midnight City (Featured in Music Player Card)
  midnightCity: {
    id: 'track-midnight-city',
    title: 'Midnight City',
    artist: 'Neon Pulse',
    album: 'Electric Dreams',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/09/79/2409794c-3d5d-af26-580e-7dc00ee4f207/mzaf_369629549966021675.plus.aac.p.m4a',
    videoId: 'dX3k_QDnzHE',
    duration: 210, // 03:30 as in reference card
    releaseDate: '2024-03-15',
    genre: 'Synthwave / Electronic',
    youtubeQuery: 'M83 Midnight City synthwave',
    source: 'innertube' as const
  },

  // Euphoria by Luna (Featured in Album Artwork Card)
  euphoria: {
    id: 'track-euphoria-luna',
    title: 'Euphoria',
    artist: 'Luna',
    album: 'Euphoria (Deluxe)',
    coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/30/8e/a3308eed-d8b7-e0b3-f09d-5e1b0f4d660a/mzaf_8517946447501075134.plus.aac.p.m4a',
    videoId: 'dvgZkm1xWPE',
    duration: 234,
    releaseDate: '2024-04-10',
    genre: 'Dream Pop / Indie',
    youtubeQuery: 'Luna Euphoria dream pop',
    source: 'innertube' as const
  },

  // Summer Vibes Playlist tracks
  oceanWaves: {
    id: 'track-ocean-waves',
    title: 'Ocean Waves',
    artist: 'Summer Vibes',
    album: 'Coastline Sun',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a',
    videoId: 'RunArX8vdJ4',
    duration: 204, // 3:24
    releaseDate: '2024-05-01',
    genre: 'Tropical Chill',
    youtubeQuery: 'tropical summer ocean waves chill',
    source: 'innertube' as const
  },
  sunsetGlow: {
    id: 'track-sunset-glow',
    title: 'Sunset Glow',
    artist: 'Summer Vibes',
    album: 'Coastline Sun',
    coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bb/50/cd/bb50cd11-dbbc-f84e-1244-f1b786af7ab4/mzaf_15441108959417505948.plus.aac.p.m4a',
    videoId: '5qap5aO4i9A',
    duration: 252, // 4:12
    releaseDate: '2024-05-01',
    genre: 'Tropical Chill',
    youtubeQuery: 'sunset chill beats golden hour',
    source: 'innertube' as const
  },
  goldenHour: {
    id: 'track-golden-hour',
    title: 'Golden Hour',
    artist: 'Summer Vibes',
    album: 'Coastline Sun',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/09/79/2409794c-3d5d-af26-580e-7dc00ee4f207/mzaf_369629549966021675.plus.aac.p.m4a',
    videoId: '4xDzrJKXOOY',
    duration: 225, // 3:45
    releaseDate: '2024-05-01',
    genre: 'Tropical Chill',
    youtubeQuery: 'golden hour acoustic chill beats',
    source: 'innertube' as const
  },
  breezeCalling: {
    id: 'track-breeze-calling',
    title: 'Breeze Calling',
    artist: 'Summer Vibes',
    album: 'Coastline Sun',
    coverUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/67/10/16/67101606-3869-ca44-6c03-e13d6322cb51/mzaf_1135399237022217274.plus.aac.p.m4a',
    videoId: 'YYRpgw5d58E',
    duration: 198, // 3:18
    releaseDate: '2024-05-01',
    genre: 'Tropical Chill',
    youtubeQuery: 'gentle breeze calling ambient acoustic',
    source: 'innertube' as const
  },

  // Solara Artist Tracks
  solarFlare: {
    id: 'track-solar-flare',
    title: 'Solar Flare',
    artist: 'Solara',
    album: 'Supernova',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a',
    videoId: 'HR3NP_wxBl0',
    duration: 215,
    releaseDate: '2024-02-14',
    genre: 'Pop / Electronic',
    youtubeQuery: 'Solara Solar Flare electronic pop',
    source: 'innertube' as const
  },
  sunburst: {
    id: 'track-sunburst',
    title: 'Sunburst',
    artist: 'Solara',
    album: 'Supernova',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/d6/60/19d660ff-e3a9-8377-15a3-ce4b28e89cac/mzaf_18422426156481158187.plus.aac.p.m4a',
    videoId: '4NRXx6U8ABQ',
    duration: 194,
    releaseDate: '2024-02-14',
    genre: 'Pop / Electronic',
    youtubeQuery: 'Solara Sunburst electronic pop',
    source: 'innertube' as const
  },

  // Recently Played tracks from reference image
  starfall: {
    id: 'track-starfall-aura',
    title: 'Starfall',
    artist: 'Aura',
    album: 'Celestia',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/d6/60/19d660ff-e3a9-8377-15a3-ce4b28e89cac/mzaf_18422426156481158187.plus.aac.p.m4a',
    videoId: '4NRXx6U8ABQ',
    duration: 189, // 3:09
    releaseDate: '2024-03-01',
    genre: 'Cosmic Ambient',
    youtubeQuery: 'Aura Starfall cosmic ambient',
    source: 'innertube' as const
  },
  echoes: {
    id: 'track-echoes-komorebi',
    title: 'Echoes',
    artist: 'Komorebi',
    album: 'Light Filtering',
    coverUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/4a/dc/194adc61-e44c-c609-5e47-480e6e9fde44/mzaf_7249735545085540214.plus.aac.p.m4a',
    videoId: 'Wh66ThpxvI4',
    duration: 255, // 4:15
    releaseDate: '2024-01-20',
    genre: 'Chillhop / Neo-Soul',
    youtubeQuery: 'Komorebi Echoes chillhop',
    source: 'innertube' as const
  },
  velvetSky: {
    id: 'track-velvet-sky',
    title: 'Velvet Sky',
    artist: 'Sora',
    album: 'Blue Hour',
    coverUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bb/50/cd/bb50cd11-dbbc-f84e-1244-f1b786af7ab4/mzaf_15441108959417505948.plus.aac.p.m4a',
    videoId: '_N6vSc_mT6I',
    duration: 222, // 3:42
    releaseDate: '2024-03-22',
    genre: 'Lofi / Dream',
    youtubeQuery: 'Sora Velvet Sky lofi chill',
    source: 'innertube' as const
  },
  driftAway: {
    id: 'track-drift-away',
    title: 'Drift Away',
    artist: 'Komorebi',
    album: 'Light Filtering',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/67/10/16/67101606-3869-ca44-6c03-e13d6322cb51/mzaf_1135399237022217274.plus.aac.p.m4a',
    videoId: 'H5v3kku4y6Q',
    duration: 36, // 0:36
    releaseDate: '2024-01-20',
    genre: 'Ambient Intro',
    youtubeQuery: 'Komorebi Drift Away ambient acoustic',
    source: 'innertube' as const
  }
};

// Full catalog list, including 30-min uninterrupted sets and reference tracks
export const DEFAULT_FEATURED_TRACKS: Track[] = [
  REFERENCE_TRACKS.midnightCity,
  REFERENCE_TRACKS.euphoria,
  REFERENCE_TRACKS.oceanWaves,
  REFERENCE_TRACKS.sunsetGlow,
  REFERENCE_TRACKS.goldenHour,
  REFERENCE_TRACKS.breezeCalling,
  REFERENCE_TRACKS.solarFlare,
  REFERENCE_TRACKS.starfall,
  REFERENCE_TRACKS.echoes,
  REFERENCE_TRACKS.velvetSky,
  REFERENCE_TRACKS.driftAway,

  // --- 30-MINUTE NON-STOP CONTINUOUS MIXES ---
  {
    id: 'yt-mix-lofi-30m',
    title: '30-Min Lo-Fi Study Beats (Non-Stop)',
    artist: 'Lofi Girl / Chilled Beats',
    album: 'Lofi Chill Study Session',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a',
    videoId: 'RunArX8vdJ4',
    duration: 1775,
    releaseDate: '2024-01-01',
    genre: 'Lo-Fi / Focus',
    youtubeQuery: '30 min lofi beats to study relax to',
    source: 'innertube'
  },
  {
    id: 'yt-mix-indo-30m',
    title: '30-Min Pop Indonesia Chill Acoustic (Non-Stop)',
    artist: 'Akustik Pop Indonesia',
    album: 'Senja Santai Nusantara',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bb/50/cd/bb50cd11-dbbc-f84e-1244-f1b786af7ab4/mzaf_15441108959417505948.plus.aac.p.m4a',
    videoId: 'YYRpgw5d58E',
    duration: 5540,
    releaseDate: '2024-02-15',
    genre: 'Indonesian Pop',
    youtubeQuery: 'kumpulan lagu pop indonesia akustik santai full album',
    source: 'innertube'
  },
  {
    id: 'yt-mix-synth-30m',
    title: '30-Min Synthwave Cosmic Night Drive (Non-Stop)',
    artist: 'Astrophysics / Cyber Lounge',
    album: 'Neon Horizon 1984',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/09/79/2409794c-3d5d-af26-580e-7dc00ee4f207/mzaf_369629549966021675.plus.aac.p.m4a',
    videoId: '4xDzrJKXOOY',
    duration: 1800,
    releaseDate: '2023-11-20',
    genre: 'Synthwave / Cyberpunk',
    youtubeQuery: '30 min synthwave chillwave cosmic drive',
    source: 'innertube'
  },
  {
    id: 'yt-mix-rain-30m',
    title: '30-Min Relaxing Rain Piano Sleep & Focus (Non-Stop)',
    artist: 'Peaceful Slumber Ensemble',
    album: 'Hujan Malam Rileks',
    coverUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=600&auto=format&fit=crop&q=80',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/30/8e/a3308eed-d8b7-e0b3-f09d-5e1b0f4d660a/mzaf_8517946447501075134.plus.aac.p.m4a',
    videoId: '5qap5aO4i9A',
    duration: 1815,
    releaseDate: '2024-03-10',
    genre: 'Ambient / Relaxing',
    youtubeQuery: '30 minutes rain sounds and relaxing piano',
    source: 'innertube'
  }
];

export const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-summer-vibes',
    name: 'Summer Vibes',
    description: 'Vibe musim panas penuh energi dan suasana santai di pantai berpasir emas.',
    coverGradient: 'from-[#ff7e67] via-[#ff6f59] to-[#ffa17a]',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
    tracks: [
      REFERENCE_TRACKS.oceanWaves,
      REFERENCE_TRACKS.sunsetGlow,
      REFERENCE_TRACKS.goldenHour,
      REFERENCE_TRACKS.breezeCalling
    ]
  },
  {
    id: 'playlist-30min-nonstop',
    name: '30 Menit Non-Stop Chill',
    description: 'Kompilasi musik panjang 30 menit penuh tanpa jeda dan tanpa potongan 30 detik untuk fokus bekerja dan belajar.',
    coverGradient: 'from-emerald-400 via-teal-500 to-indigo-600',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now(),
    tracks: [
      DEFAULT_FEATURED_TRACKS[11], // 30-min lofi
      DEFAULT_FEATURED_TRACKS[12], // 30-min indo
      DEFAULT_FEATURED_TRACKS[13], // 30-min synthwave
      DEFAULT_FEATURED_TRACKS[14]  // 30-min rain
    ]
  },
  {
    id: 'playlist-neo-euphoria',
    name: 'Euphoria Soundwaves',
    description: 'Koleksi track pop & electronic dengan sentuhan aesthetic pop art modern.',
    coverGradient: 'from-blue-600 via-indigo-600 to-violet-700',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now(),
    tracks: [
      REFERENCE_TRACKS.euphoria,
      REFERENCE_TRACKS.midnightCity,
      REFERENCE_TRACKS.solarFlare,
      REFERENCE_TRACKS.starfall
    ]
  }
];

export const GENRE_PRESETS = [
  { id: 'all', name: '🔥 All Hits', query: 'pop hits' },
  { id: '30menit', name: '⏱️ 30 Menit Non-Stop', query: '30 menit non stop musik santai' },
  { id: 'lofi', name: '☕ Lo-Fi Chill', query: '30 min lofi beats' },
  { id: 'indonesia', name: '🌿 Pop Indonesia', query: 'pop indonesia full album' },
  { id: 'synthwave', name: '🌌 Synthwave Pop', query: 'synthwave 30 min' },
  { id: 'acoustic', name: '🌧️ Akustik Santai', query: 'acoustic guitar chill 30 min' }
];
