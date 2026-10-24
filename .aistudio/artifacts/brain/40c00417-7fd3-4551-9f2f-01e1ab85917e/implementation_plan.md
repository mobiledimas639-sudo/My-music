# Aurora Sound: Spotify & YouTube Music Liquid Glass Web App

Aurora Sound adalah aplikasi pemutar musik modern bergaya hybrid Spotify dan YouTube Music dengan antarmuka visual **Liquid Glass** (frosted glassmorphism transparan, aurora ambient glow dinamis, dan tipografi tajam), integrasi pencarian katalog musik pihak ketiga dengan audio streaming langsung, serta sistem pengelolaan playlist kustom lengkap dengan impor/ekspor data.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan klarifikasi pada Tahap 1, preferensi pengguna berikut telah dikonfirmasi dan dijadikan acuan utama pengembangan:

- **Confirmed Decision 1 (Katalog & Streaming)**: Hybrid iTunes Search API (metadata resmi artis/album/lagu, audio preview 30 detik instan tanpa API key) dipadukan dengan pemutar YouTube Embed terintegrasi untuk mendengarkan versi lengkap lagu/video klip musik.
- **Confirmed Decision 2 (Aksen Visual & Liquid Glass)**: Tema **Deep Aurora** dengan cosmic obsidian glass (`backdrop-blur-2xl bg-slate-950/40`), pantulan border tipis berpendar (`border-white/10`), serta ambient glow hijau emerald (`#10b981`) dan ungu aurora violet (`#8b5cf6`) yang bergerak halus mengikuti visualizer dan artwork album.
- **Confirmed Decision 3 (Penyimpanan & Manajemen Playlist)**: Penyimpanan persisten lokal (`localStorage`) dengan fitur sinkronisasi ekspor/impor file JSON, pembuatan playlist kustom tanpa batas, penambahan/penghapusan lagu, toggle suka (Liked Songs), dan antrean putar (Play Queue).

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**: Web app streaming musik profesional yang menggabungkan kenyamanan navigasi Spotify (sidebar playlist, library, antrean putar, bar kontrol bawah persisten) dengan fleksibilitas YouTube Music (mode video klip, lirik/info, dan visualizer aurora).
- **Target Pengguna**: Pecinta musik yang menginginkan pemutar musik web elegan, bebas hambatan, responsif di desktop maupun tablet/mobile, dengan audio instan dan kemampuan membuat koleksi playlist pribadi.
- **Nilai Tambah Utama**:
  1. Tampilan **Liquid Glass** ultra-modern berstandar studio desain dengan efek glassmorphism berlapis, pantulan cahaya, dan ambient backdrop.
  2. Pencarian katalog global nyata via iTunes API publik (miliaran trek, artwork resolusi tinggi, audio preview instan tanpa lag) + YouTube audio/video fallback.
  3. Fitur playlist interaktif penuh: buat playlist baru, edit nama & deskripsi, tambah/hapus trek dari lagu yang sedang diputar atau hasil pencarian, drag & reorder, serta ekspor & impor backup JSON.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Discover & Home**: Pengguna disambut oleh banner hero aurora dengan trek unggulan, quick-mix bar (Pop, Rock, Hip-hop, Lo-Fi, R&B, Acoustic), rilis terbaru, dan playlist kurasi bawaan.
2. **Search & Instant Preview**: Mengetik artis/judul di kolom pencarian real-time memanggil API pihak ketiga; hasil ditampilkan dalam format grid kartu kaca dan daftar baris lagu. Mengklik tombol Play langsung memutar lagu tanpa refresh.
3. **Player Bar & Mini Player**: Bar pemutar bawah melayang (*floating liquid dock*) dengan kontrol putar/jeda, scrubber durasi dengan waktu real-time, volume slider, tombol shuffle & repeat, antrean (*queue drawer*), dan toggle mode YouTube Video Embed.
4. **Custom Playlist Creation**:
   - Klik tombol "+ Buat Playlist" di sidebar atau menu bar.
   - Modal Liquid Glass muncul untuk menginput judul, deskripsi, dan cover gradient/ikon.
   - Tambahkan lagu langsung dari tombol menu "Tambah ke Playlist" di setiap kartu/baris lagu.
   - Kelola playlist: urutkan, hapus lagu, putar seluruh isi playlist, atau download file backup `.json`.
5. **Liked Songs & Antrean (Queue)**: Akses cepat ke koleksi lagu favorit dengan ikon hati (heart toggle) dan panel antrean putar yang dapat diatur ulang.

### Visual Identity & Theme (Deep Aurora Liquid Glass)
- **Aesthetic Direction**: Neo-futuristic Liquid Glassmorphism. Elemen UI tampak seperti kaca tebal kristal melayang di atas nebula aurora kosmik yang hidup.
- **Color Palette**:
  - *Canvas*: Cosmic Obsidian (`#030712`, `#0B0F19`)
  - *Glass Surfaces*: `rgba(15, 23, 42, 0.45)` dengan `backdrop-blur-2xl` dan `border: 1px solid rgba(255, 255, 255, 0.08)`
  - *Aurora Accents*: Emerald Neon (`#10B981`), Cyber Violet (`#8B5CF6`), dan Electric Teal (`#06B6D4`)
  - *Typography*: Teks primer putih bersih (`#F9FAFB`), teks sekunder abu-abu dingin (`#94A3B8`), angka tabular durasi (`tabular-nums font-mono`).
- **Typography & Scale**: `Plus Jakarta Sans` / modern neo-grotesque sans untuk judul dan menu navigasi, dengan hierarki bersih tanpa pill box dekoratif berlebihan.
- **Micro-Interactions**: Transisi tombol $\le 150\text{ms}$, visualizer gelombang audio animasi dinamis saat trek berstatus playing, hover glow pada artwork album, dan sliding drawer untuk antrean/lirik.

---

## 3. Key Product Decisions & Trade-Offs

- **Hybrid Audio Engine (HTML5 Audio + YouTube IFrame fallback)**:
  - *Pendekatan*: Memutar audio preview 256kbps instan melalui HTML5 `<audio>` element dari iTunes Search API tanpa latensi atau autentikasi rumit. Disediakan toggle "Mode YouTube Full Audio/Video" di mana pemutar beralih ke modal/drawer video YouTube tersinkronisasi untuk mendengarkan lagu secara penuh.
  - *Alasan*: Menjamin responsivitas seketika (audio langsung berbunyi dalam hitungan milidetik saat diklik) sekaligus memberikan opsi mendengar durasi penuh bagi lagu populer.
- **Penyimpanan Lokal Persisten + Backup Ekspor/Impor JSON**:
  - *Pendekatan*: State playlist kustom dan lagu favorit disimpan di browser pengguna (`localStorage`) dengan skema data terstruktur. Disediakan tombol satu-klik "Ekspor Data" dan "Impor Playlist" agar data aman dan dapat dipindahkan antar browser/perangkat.
  - *Alasan*: Bebas login/registrasi yang merepotkan, data instan tersedia offline, privasi penuh, dan tanpa ketergantungan kuota backend database.
- **Zero-Dead-Click Policy & Error Resiliency**:
  - *Pendekatan*: Setiap tombol (play, pause, next, previous, shuffle, repeat, mute, add to playlist, create playlist, delete playlist, export, import) memiliki event handler yang aktif dan andal dengan penanganan error jaringan (fallbacks ke trek lokal/sampel jika offline).

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AURORA SOUND WEB APP                            │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar (Liquid Glass Nav): Brand Wordmark, Nav Links, Search, Backup │
├────────────────────────────────┬───────────────────────────────────────┤
│  Sidebar (Liquid Glass):       │  Main Content Viewport:               │
│  - Home / Temukan              │  - Hero Aurora Banner                 │
│  - Liked Songs                 │  - Quick Genre Pill Filters           │
│  - Koleksi Playlist Kustom     │  - Featured Music Carousel            │
│  - Tombol "+ Buat Playlist"    │  - Search Results & Song Tables       │
│  - Tombol Ekspor/Impor JSON    │  - Playlist Detail & Management View  │
├────────────────────────────────┴───────────────────────────────────────┤
│  Floating Liquid Dock Player (Sticky Bottom Bar):                      │
│  - Track Info (Artwork, Title, Artist, Like Button)                    │
│  - Playback Controls (Shuffle, Prev, Play/Pause, Next, Repeat)         │
│  - Scrubber Bar (Current Time, Slider Seek, Duration, Tabular Nums)    │
│  - Right Actions: Volume Slider, Queue Drawer, YouTube Embed Mode      │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │
     ┌───────────────────────────┴───────────────────────────┐
     ▼                                                       ▼
┌─────────────────────────────┐         ┌─────────────────────────────┐
│  State & Storage Layer      │         │  External APIs & Media      │
│  - useAudioPlayer (HTML5)   │         │  - iTunes Search Public API │
│  - usePlaylistStore         │         │  - Deezer preview proxy     │
│  - localStorage persistence │         │  - YouTube Embed IFrame     │
│  - JSON Import/Export Engine│         │  - Dynamic Audio Visualizer │
└─────────────────────────────┘         └─────────────────────────────┘
```

### Data Models & State Structure

```typescript
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl: string;
  duration: number; // in seconds
  releaseDate?: string;
  genre?: string;
  youtubeQuery?: string;
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

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  queueIndex: number;
  youtubeMode: boolean;
}
```

### Verification & Implementation Plan
1. **Setup Assets & Metadata**: Konfigurasi `index.html` dan `metadata.json` dengan branding Aurora Sound.
2. **Audio & API Service**: Modul pencarian iTunes API dengan caching, debouncing query, penanganan error, dan integrasi pemutar audio HTML5.
3. **Liquid Glass UI System**: Styling Tailwind CSS khusus dengan efek frosted glass (`backdrop-blur`), border cahaya halus, dan animasi visualizer audio.
4. **Playlist Manager & Local Storage**: Fitur CRUD playlist lengkap, toggle like, antrean lagu, dan fungsi ekspor/impor file JSON.
5. **Testing & Build Verification**: Uji kompilasi dengan `compile_applet` untuk memastikan zero syntax/type errors.
