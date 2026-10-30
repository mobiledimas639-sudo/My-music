import { Track } from '../types/music';
import { searchTracks } from './musicApi';
import { REFERENCE_TRACKS, DEFAULT_FEATURED_TRACKS } from '../data/defaultCatalog';

export interface FeaturedArtistProfile {
  id: string;
  name: string;
  avatarUrl: string;
  genres: string;
  description: string;
  relatedArtists: string[];
  bannerGradient: string;
  searchQuery: string;
}

export interface DailyMixCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  artistsSummary: string;
  searchQuery: string;
  accentColor: string;
}

// Curated artist roster for daily randomized spotlight
export const ARTIST_ROSTER: FeaturedArtistProfile[] = [
  {
    id: 'bernadya',
    name: 'Bernadya',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    genres: 'Indie Pop • Pop Akustik',
    description: 'Penyanyi & penulis lagu asal Surabaya dengan lirik melankolis yang dekat dengan hati.',
    relatedArtists: ['Nadin Amizah', 'Sal Priadi', 'Feby Putri', 'Mahalini'],
    bannerGradient: 'from-amber-400 via-rose-400 to-indigo-600',
    searchQuery: 'Bernadya lagu'
  },
  {
    id: 'ariana-grande',
    name: 'Ariana Grande',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    genres: 'Pop • Contemporary R&B',
    description: 'Vokalis global pemenang Grammy dengan jangkauan vokal empat oktaf legendaris.',
    relatedArtists: ['The Weeknd', 'Lady Gaga', 'Doja Cat', 'Billie Eilish'],
    bannerGradient: 'from-pink-400 via-rose-500 to-purple-600',
    searchQuery: 'Ariana Grande'
  },
  {
    id: 'tulus',
    name: 'Tulus',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    genres: 'Pop • Jazz Nusantara',
    description: 'Musisi legendaris Indonesia dengan lirik puitis dan aransemen megah.',
    relatedArtists: ['Yura Yunita', 'Pamungkas', 'Kunto Aji', 'Sheila on 7'],
    bannerGradient: 'from-emerald-400 via-teal-500 to-blue-600',
    searchQuery: 'Tulus lagu populer'
  },
  {
    id: 'sheila-on-7',
    name: 'Sheila On 7',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    genres: 'Pop Rock • Pop 2000an',
    description: 'Band pop legendaris Yogyakarta yang menemani masa remaja berbagai generasi.',
    relatedArtists: ['Dewa 19', 'Padi', 'Noah', 'Jikustik'],
    bannerGradient: 'from-yellow-400 via-orange-500 to-red-600',
    searchQuery: 'Sheila On 7 hits'
  },
  {
    id: 'sal-priadi',
    name: 'Sal Priadi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    genres: 'Indie Pop • Folk Teatrikal',
    description: 'Musisi puitis asal Malang yang membawakan kisah hangat tentang kehidupan dan kasih.',
    relatedArtists: ['Bernadya', 'Nadin Amizah', 'Hindia', 'Juicy Luicy'],
    bannerGradient: 'from-amber-300 via-yellow-500 to-emerald-600',
    searchQuery: 'Sal Priadi lagu'
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    genres: 'R&B • Synth-pop • Dark Wave',
    description: 'Ikon pop global pelopor synth-wave modern dan melodi R&B futuristik.',
    relatedArtists: ['Bruno Mars', 'Post Malone', 'Drake', 'Ariana Grande'],
    bannerGradient: 'from-red-600 via-rose-700 to-slate-900',
    searchQuery: 'The Weeknd hits'
  },
  {
    id: 'ghea-indrawari',
    name: 'Ghea Indrawari',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    genres: 'Pop Indonesia • Ballad Emosional',
    description: 'Suara lembut penuh penghayatan yang menemani jiwa yang bersedih dan rindu.',
    relatedArtists: ['Mahalini', 'Tiara Andini', 'Ziva Magnolya', 'Nadin Amizah'],
    bannerGradient: 'from-purple-400 via-pink-400 to-sky-500',
    searchQuery: 'Ghea Indrawari'
  },
  {
    id: 'coldplay',
    name: 'Coldplay',
    avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80',
    genres: 'Alternative Rock • Pop Anthem',
    description: 'Band stadion legendaris asal Inggris dengan melodi anthem yang memikat dunia.',
    relatedArtists: ['The Killers', 'Imagine Dragons', 'OneRepublic', 'U2'],
    bannerGradient: 'from-cyan-400 via-blue-500 to-indigo-700',
    searchQuery: 'Coldplay best songs'
  },
  {
    id: 'bruno-mars',
    name: 'Bruno Mars',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    genres: 'Funk • R&B • Pop',
    description: 'Penampil panggung karismatik dengan groove funk yang menular dan melodi romantis.',
    relatedArtists: ['Anderson .Paak', 'Silk Sonic', 'The Weeknd', 'Ed Sheeran'],
    bannerGradient: 'from-yellow-400 via-amber-500 to-rose-600',
    searchQuery: 'Bruno Mars'
  },
  {
    id: 'juicy-luicy',
    name: 'Juicy Luicy',
    avatarUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    genres: 'Pop Jazz • Akustik Galau',
    description: 'Band pop asal Bandung yang ahli meramu lirik patah hati dengan nada yang asik.',
    relatedArtists: ['Sal Priadi', 'Bernadya', 'Hindia', 'Feby Putri'],
    bannerGradient: 'from-orange-400 via-amber-500 to-teal-600',
    searchQuery: 'Juicy Luicy'
  }
];

// Daily Mixes that rotate their ordering & content
export const DAILY_MIX_TEMPLATES: DailyMixCard[] = [
  {
    id: 'mix-1',
    title: 'Daily Mix 1',
    subtitle: 'Pop Indonesia & Akustik Senja',
    description: 'Bernadya, Sal Priadi, Nadin Amizah, dan lagu-lagu hangat penenang hati.',
    gradient: 'from-[#FFE853] via-[#FF6F59] to-[#2B50D9]',
    artistsSummary: 'Bernadya • Sal Priadi • Nadin Amizah',
    searchQuery: 'pop indonesia akustik santai',
    accentColor: '#FFE853'
  },
  {
    id: 'mix-2',
    title: 'Daily Mix 2',
    subtitle: 'Global Pop & Groovy Hits',
    description: 'The Weeknd, Ariana Grande, Bruno Mars, dan lagu-lagu pengiring semangat hari ini.',
    gradient: 'from-[#86E3CE] via-[#2B50D9] to-[#7C3AED]',
    artistsSummary: 'The Weeknd • Ariana Grande • Bruno Mars',
    searchQuery: 'global pop hits billboard',
    accentColor: '#86E3CE'
  },
  {
    id: 'mix-3',
    title: 'Daily Mix 3',
    subtitle: 'Indie Sore & Chillwave Lo-Fi',
    description: 'Komorebi, Hindia, Pamungkas, dan ketukan santai untuk bekerja santai.',
    gradient: 'from-[#D0E6A5] via-[#4ADE80] to-[#0D9488]',
    artistsSummary: 'Hindia • Pamungkas • Lo-Fi Chill',
    searchQuery: 'indie indonesia chill lofi',
    accentColor: '#D0E6A5'
  },
  {
    id: 'mix-4',
    title: 'Daily Mix 4',
    subtitle: 'Nostalgia & Pop Rock Klasik',
    description: 'Sheila on 7, Dewa 19, Coldplay, dan melodi yang membangkitkan kenangan manis.',
    gradient: 'from-[#FF92A5] via-[#E11D48] to-[#4F46E5]',
    artistsSummary: 'Sheila on 7 • Dewa 19 • Coldplay',
    searchQuery: 'lagu pop nostalgia indonesia hits',
    accentColor: '#FF92A5'
  }
];

// Helper to generate a deterministic daily pseudo-random number
export function getDailySeed(offset: number = 0): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash + offset);
}

// Formats today's date in Indonesian friendly string
export function getIndonesianDateString(): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return new Intl.DateTimeFormat('id-ID', options).format(new Date());
}

// Built-in starter recommendations that guarantee immediate instant render
export const FALLBACK_DAILY_TRACKS: Track[] = [
  {
    id: 'rec-1',
    title: 'Gala Bunga Matahari',
    artist: 'Sal Priadi',
    album: 'MARKERS AND SUCH PENS FLASHDISKS',
    coverUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: '0S0gYCRWeSI',
    duration: 238,
    genre: 'Indie Pop',
    youtubeQuery: 'Sal Priadi Gala Bunga Matahari audio',
    source: 'innertube'
  },
  {
    id: 'rec-2',
    title: 'Satu Bulan',
    artist: 'Bernadya',
    album: 'Sialnya, Hidup Harus Tetap Berjalan',
    coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: 'YYRpgw5d58E',
    duration: 198,
    genre: 'Pop Akustik',
    youtubeQuery: 'Bernadya Satu Bulan audio',
    source: 'innertube'
  },
  {
    id: 'rec-3',
    title: 'we can\'t be friends',
    artist: 'Ariana Grande',
    album: 'eternal sunshine',
    coverUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: 'dX3k_QDnzHE',
    duration: 228,
    genre: 'Pop',
    youtubeQuery: 'Ariana Grande we cant be friends audio',
    source: 'innertube'
  },
  {
    id: 'rec-4',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    album: 'Die With A Smile - Single',
    coverUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: 'dvgZkm1xWPE',
    duration: 251,
    genre: 'Pop / Soul',
    youtubeQuery: 'Lady Gaga Bruno Mars Die With A Smile audio',
    source: 'innertube'
  },
  {
    id: 'rec-5',
    title: 'Film Favorit',
    artist: 'Sheila On 7',
    album: 'Film Favorit - Single',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: 'RunArX8vdJ4',
    duration: 227,
    genre: 'Pop Rock',
    youtubeQuery: 'Sheila On 7 Film Favorit official audio',
    source: 'innertube'
  },
  {
    id: 'rec-6',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: '4xDzrJKXOOY',
    duration: 200,
    genre: 'Synthwave Pop',
    youtubeQuery: 'The Weeknd Blinding Lights audio',
    source: 'innertube'
  },
  {
    id: 'rec-7',
    title: 'Hati-Hati di Jalan',
    artist: 'Tulus',
    album: 'Manusia',
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: '5qap5aO4i9A',
    duration: 242,
    genre: 'Pop',
    youtubeQuery: 'Tulus Hati Hati di Jalan audio',
    source: 'innertube'
  },
  {
    id: 'rec-8',
    title: 'Jiwa Yang Bersedih',
    artist: 'Ghea Indrawari',
    album: 'Jiwa Yang Bersedih',
    coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: '_N6vSc_mT6I',
    duration: 278,
    genre: 'Pop Ballad',
    youtubeQuery: 'Ghea Indrawari Jiwa Yang Bersedih audio',
    source: 'innertube'
  }
];

// Curated 30-min long sessions pool
export const ROTATING_30MIN_SESSIONS: Track[] = [
  DEFAULT_FEATURED_TRACKS[11] || {
    id: 'sess-1',
    title: '30-Min Lo-Fi Study Beats (Non-Stop)',
    artist: 'Lofi Girl / Chilled Beats',
    album: 'Lofi Chill Study Session',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: 'RunArX8vdJ4',
    duration: 1775,
    genre: 'Lo-Fi / Focus',
    youtubeQuery: '30 min lofi beats to study relax to',
    source: 'innertube'
  },
  DEFAULT_FEATURED_TRACKS[12] || {
    id: 'sess-2',
    title: '30-Min Pop Indonesia Chill Acoustic (Non-Stop)',
    artist: 'Akustik Pop Indonesia',
    album: 'Senja Santai Nusantara',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: 'YYRpgw5d58E',
    duration: 5540,
    genre: 'Indonesian Pop',
    youtubeQuery: 'kumpulan lagu pop indonesia akustik santai full album',
    source: 'innertube'
  },
  DEFAULT_FEATURED_TRACKS[13] || {
    id: 'sess-3',
    title: '30-Min Synthwave Cosmic Night Drive (Non-Stop)',
    artist: 'Astrophysics / Cyber Lounge',
    album: 'Neon Horizon 1984',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: '4xDzrJKXOOY',
    duration: 1800,
    genre: 'Synthwave / Cyberpunk',
    youtubeQuery: '30 min synthwave chillwave cosmic drive',
    source: 'innertube'
  },
  DEFAULT_FEATURED_TRACKS[14] || {
    id: 'sess-4',
    title: '30-Min Relaxing Rain Piano Sleep & Focus (Non-Stop)',
    artist: 'Peaceful Slumber Ensemble',
    album: 'Hujan Malam Rileks',
    coverUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=600&auto=format&fit=crop&q=80',
    previewUrl: '',
    videoId: '5qap5aO4i9A',
    duration: 1815,
    genre: 'Ambient / Relaxing',
    youtubeQuery: '30 minutes rain sounds and relaxing piano',
    source: 'innertube'
  }
];
