/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ActiveView, Track, Playlist } from './types/music';
import { DEFAULT_FEATURED_TRACKS, REFERENCE_TRACKS } from './data/defaultCatalog';
import { searchTracks } from './services/musicApi';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useMusicStorage } from './hooks/useMusicStorage';

import { MemphisBackdrop } from './components/MemphisBackdrop';
import { NeoNavbar } from './components/NeoNavbar';
import { NeoHomeView } from './components/NeoHomeView';
import { NeoDockPlayer } from './components/NeoDockPlayer';
import { NeoBottomNavBar } from './components/NeoBottomNavBar';
import { SearchView } from './components/SearchView';
import { LikedSongsView } from './components/LikedSongsView';
import { PlaylistsView } from './components/PlaylistsView';
import { PlaylistDetailView } from './components/PlaylistDetailView';
import { QueueDrawer } from './components/QueueDrawer';
import { PlaylistModal } from './components/PlaylistModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { YouTubeModal } from './components/YouTubeModal';
import { AudioSpectrumVisualizer } from './components/AudioSpectrumVisualizer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Navigation View State
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'home' });
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false);
  const [isSpectrumExpanded, setIsSpectrumExpanded] = useState(false);

  // Full Player Modal & Feature Tabs State (Antrean, Waktu Tidur, Lirik)
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [fullPlayerTab, setFullPlayerTab] = useState<'player' | 'queue' | 'lyrics'>('player');

  // Dynamic Featured Tracks (starts with verified defaults & reference tracks)
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>(DEFAULT_FEATURED_TRACKS);

  // Search State (Unified global search combining InnerTube and all sources)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Modal States
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState<Playlist | null>(null);

  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [trackForAddToPlaylist, setTrackForAddToPlaylist] = useState<Track | null>(null);

  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [trackForYouTube, setTrackForYouTube] = useState<Track | null>(null);

  // Toasts feedback system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      text
    };
    setToasts(prev => [...prev.slice(-3), newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Storage Hook (Custom Playlists & Liked Songs & Real-Time Play History)
  const {
    playlists,
    likedTracks,
    recentlyPlayedTracks,
    recordTrackPlayed,
    clearPlayHistory,
    isLiked,
    toggleLikeTrack,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    exportLibraryAsJSON,
    importLibraryFromJSON
  } = useMusicStorage();

  // Audio Player Hook
  const {
    currentTrack,
    isPlaying,
    isLoading,
    playerError,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    queueIndex,
    youtubeMode,
    setYoutubeMode,
    playTrack,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    removeFromQueue,
    clearQueue,
    getFrequencyData,
    sleepTimerSetting,
    sleepTimerRemaining,
    setSleepTimer,
    cancelSleepTimer
  } = useAudioPlayer();

  // Load fresh hits on background startup
  useEffect(() => {
    let isMounted = true;
    async function loadFreshHits() {
      try {
        const live = await searchTracks('lagu pop indonesia hits terbaru', 8);
        if (isMounted && live.length > 0) {
          setFeaturedTracks(prev => {
            const liveIds = new Set(live.map(t => t.id));
            const remaining = prev.filter(t => !liveIds.has(t.id));
            return [...remaining, ...live];
          });
        }
      } catch (err) {
        console.warn('Initial live tracks fetch failed, using built-in catalog', err);
      }
    }
    loadFreshHits();
    return () => { isMounted = false; };
  }, []);

  // Real-time playback history recorded automatically by the system
  useEffect(() => {
    if (currentTrack && currentTrack.id) {
      recordTrackPlayed(currentTrack);
    }
  }, [currentTrack, recordTrackPlayed]);

  // Play track with queue update & real-time history recording
  const handlePlayTrack = useCallback((track: Track, newQueue?: Track[]) => {
    recordTrackPlayed(track);
    playTrack(track, newQueue);
  }, [playTrack, recordTrackPlayed]);

  // Open YouTube full player modal
  const handleOpenYouTube = (track: Track) => {
    setTrackForYouTube(track);
    setIsYouTubeModalOpen(true);
  };

  // Perform Search (Unified InnerTube + Catalog with large variety)
  const handlePerformSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setSearchQuery(query);
    try {
      const results = await searchTracks(query, 60);
      setSearchResults(results);
      if (results.length === 0) {
        addToast('info', `Tidak ditemukan hasil untuk "${query}". Coba kata kunci lain.`);
      }
    } catch {
      addToast('error', 'Gagal memuat hasil pencarian. Periksa koneksi internet.');
    } finally {
      setIsSearching(false);
    }
  }, [addToast]);

  // Add track to custom playlist handler
  const handleOpenAddToPlaylist = (track: Track) => {
    setTrackForAddToPlaylist(track);
    setIsAddToPlaylistModalOpen(true);
  };

  const handleAddTrack = (playlistId: string, track: Track) => {
    const ok = addTrackToPlaylist(playlistId, track);
    if (ok) {
      const targetPl = playlists.find(p => p.id === playlistId);
      addToast('success', `Ditambahkan ke "${targetPl?.name || 'Playlist'}"`);
      return true;
    } else {
      addToast('info', 'Lagu sudah ada di dalam playlist ini.');
      return false;
    }
  };

  // Like track toggle with toast feedback
  const handleToggleLike = (track: Track) => {
    const wasLiked = isLiked(track.id);
    toggleLikeTrack(track);
    if (wasLiked) {
      addToast('info', `Dihapus dari Favorit: ${track.title}`);
    } else {
      addToast('success', `Disukai: ${track.title}`);
    }
  };

  // Delete playlist with confirmation
  const handleDeletePlaylist = (id: string, name: string) => {
    if (window.confirm(`Hapus playlist "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deletePlaylist(id);
      addToast('info', `Playlist "${name}" telah dihapus.`);
      if (activeView.type === 'playlist' && activeView.playlistId === id) {
        setActiveView({ type: 'home' });
      }
    }
  };

  // Save playlist (create or update)
  const handleSavePlaylist = (name: string, description: string, gradient: string) => {
    if (playlistToEdit) {
      updatePlaylist(playlistToEdit.id, { name, description, coverGradient: gradient });
      addToast('success', `Playlist "${name}" berhasil diperbarui.`);
      setPlaylistToEdit(null);
    } else {
      const created = createPlaylist(name, description, gradient);
      addToast('success', `Playlist "${created.name}" berhasil dibuat!`);
      setActiveView({ type: 'playlist', playlistId: created.id });
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    exportLibraryAsJSON();
    addToast('success', 'File cadangan playlist JSON berhasil diunduh!');
  };

  // Import JSON backup
  const handleImportBackup = (jsonContent: string) => {
    const res = importLibraryFromJSON(jsonContent);
    if (res.success) {
      addToast('success', res.message);
    } else {
      addToast('error', res.message);
    }
  };

  // Selected playlist object if in playlist view
  const currentPlaylist = activeView.type === 'playlist'
    ? playlists.find(p => p.id === activeView.playlistId)
    : null;

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-slate-900 flex flex-col relative selection:bg-[#FFE853] selection:text-slate-950 font-sans">
      
      {/* 1. Subtle Memphis Pastel Background Shapes */}
      <MemphisBackdrop />

      {/* 2. Top Header (MUSIC APP [BETA], Search bar pill, User Avatar) */}
      <NeoNavbar
        activeView={activeView}
        setActiveView={setActiveView}
        onSearch={(q) => {
          handlePerformSearch(q);
        }}
        onOpenCreatePlaylist={() => {
          setPlaylistToEdit(null);
          setIsPlaylistModalOpen(true);
        }}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onToggleYouTubeMode={() => {
          if (currentTrack) {
            handleOpenYouTube(currentTrack);
          } else if (featuredTracks.length > 0) {
            handleOpenYouTube(featuredTracks[0]);
          }
        }}
        isYouTubeMode={youtubeMode}
      />

      {/* 3. Main Bento Viewport (Full width matching reference image composition) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-10 min-w-0 relative z-10 pb-48 sm:pb-52">
        
        {/* VIEW: HOME DASHBOARD */}
        {activeView.type === 'home' && (
          <NeoHomeView
            featuredTracks={featuredTracks}
            playlists={playlists}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            isShuffle={isShuffle}
            repeatMode={repeatMode}
            isLiked={isLiked}
            isYouTubeMode={youtubeMode}
            activeView={activeView}
            setActiveView={setActiveView}
            onPlayTrack={handlePlayTrack}
            onTogglePlay={togglePlay}
            onPrev={playPrev}
            onNext={playNext}
            onSeek={seek}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            onToggleShuffle={toggleShuffle}
            onCycleRepeat={cycleRepeat}
            onToggleLike={handleToggleLike}
            onToggleYouTubeMode={() => {
              if (currentTrack) {
                handleOpenYouTube(currentTrack);
              }
            }}
            onOpenCreatePlaylist={() => {
              setPlaylistToEdit(null);
              setIsPlaylistModalOpen(true);
            }}
            onOpenQueue={() => setIsQueueDrawerOpen(true)}
            onExportBackup={handleExportBackup}
            onOpenYouTubeModal={handleOpenYouTube}
            onToggleSpectrum={() => setIsSpectrumExpanded(prev => !prev)}
            onSelectPlaylist={(pId) => setActiveView({ type: 'playlist', playlistId: pId })}
            onAddToPlaylist={handleOpenAddToPlaylist}
            recentlyPlayedTracks={recentlyPlayedTracks}
            onClearHistory={clearPlayHistory}
            onOpenFullPlayer={() => {
              setFullPlayerTab('player');
              setIsFullPlayerOpen(true);
            }}
          />
        )}

        {/* VIEW: SEARCH & CATALOG (UNIFIED NO ENGINE SELECTION) */}
        {activeView.type === 'search' && (
          <SearchView
            query={searchQuery}
            tracks={searchResults.length > 0 ? searchResults : featuredTracks}
            isLoading={isSearching}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            isLiked={isLiked}
            onSearch={handlePerformSearch}
            onPlayTrack={handlePlayTrack}
            onTogglePlay={togglePlay}
            onToggleLike={handleToggleLike}
            onAddToPlaylist={handleOpenAddToPlaylist}
            onOpenYouTube={handleOpenYouTube}
          />
        )}

        {/* VIEW: LIKED SONGS */}
        {activeView.type === 'liked' && (
          <LikedSongsView
            likedTracks={likedTracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            isLiked={isLiked}
            onPlayTrack={handlePlayTrack}
            onTogglePlay={togglePlay}
            onToggleLike={handleToggleLike}
            onAddToPlaylist={handleOpenAddToPlaylist}
            onOpenYouTube={handleOpenYouTube}
            onGoToSearch={() => setActiveView({ type: 'search', query: '' })}
          />
        )}

        {/* VIEW: ALL PLAYLISTS COLLECTION (INCLUDES FAVORITES LIKE LIKED SONGS) */}
        {activeView.type === 'playlists' && (
          <PlaylistsView
            playlists={playlists}
            likedTracks={likedTracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectPlaylist={(pId) => setActiveView({ type: 'playlist', playlistId: pId })}
            onOpenLikedSongs={() => setActiveView({ type: 'liked' })}
            onPlayPlaylist={(pl) => {
              if (pl.tracks.length > 0) {
                handlePlayTrack(pl.tracks[0], pl.tracks);
              }
            }}
            onPlayLikedSongs={() => {
              if (likedTracks.length > 0) {
                handlePlayTrack(likedTracks[0], likedTracks);
              }
            }}
            onOpenCreatePlaylist={() => {
              setPlaylistToEdit(null);
              setIsPlaylistModalOpen(true);
            }}
            onEditPlaylist={(pl) => {
              setPlaylistToEdit(pl);
              setIsPlaylistModalOpen(true);
            }}
            onDeletePlaylist={handleDeletePlaylist}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}

        {/* VIEW: PLAYLIST DETAIL */}
        {activeView.type === 'playlist' && currentPlaylist && (
          <PlaylistDetailView
            playlist={currentPlaylist}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            isLiked={isLiked}
            onPlayTrack={handlePlayTrack}
            onTogglePlay={togglePlay}
            onToggleLike={handleToggleLike}
            onAddToPlaylist={handleOpenAddToPlaylist}
            onRemoveTrack={removeTrackFromPlaylist}
            onEditPlaylist={(pl) => {
              setPlaylistToEdit(pl);
              setIsPlaylistModalOpen(true);
            }}
            onDeletePlaylist={handleDeletePlaylist}
            onOpenYouTube={handleOpenYouTube}
            onGoToSearch={() => setActiveView({ type: 'search', query: '' })}
          />
        )}
      </main>

      {/* 4. Persistent Dock Player when navigating views or on active playback */}
      {currentTrack && (
        <NeoDockPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isLiked={isLiked(currentTrack.id)}
          isYouTubeMode={youtubeMode}
          sleepTimerRemaining={sleepTimerRemaining}
          onTogglePlay={togglePlay}
          onPrev={playPrev}
          onNext={playNext}
          onSeek={seek}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onToggleLike={handleToggleLike}
          onToggleYouTubeMode={() => {
            if (currentTrack) {
              handleOpenYouTube(currentTrack);
            }
          }}
          onOpenYouTubeModal={handleOpenYouTube}
          onToggleSpectrum={() => setIsSpectrumExpanded(prev => !prev)}
          onOpenFullPlayer={() => {
            setFullPlayerTab('player');
            setIsFullPlayerOpen(true);
          }}
        />
      )}

      {/* 4b. Persistent Neo-Brutalist Bottom Navigation Bar (Direct access to Home, Search, Liked, Playlists) */}
      <NeoBottomNavBar
        activeView={activeView}
        setActiveView={setActiveView}
        likedTracksCount={likedTracks.length}
        playlistsCount={playlists.length}
      />

      {/* 5. Full Player Modal (Expanded View with Antrean, Waktu Tidur, and Lirik Sinkron) */}
      <FullPlayerModal
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isLiked={currentTrack ? isLiked(currentTrack.id) : false}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        queue={queue}
        queueIndex={queueIndex}
        sleepTimerSetting={sleepTimerSetting}
        sleepTimerRemaining={sleepTimerRemaining}
        activeTab={fullPlayerTab}
        setActiveTab={setFullPlayerTab}
        onTogglePlay={togglePlay}
        onPrev={playPrev}
        onNext={playNext}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onToggleLike={handleToggleLike}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={cycleRepeat}
        onSelectTrack={(t, q) => handlePlayTrack(t, q)}
        onRemoveFromQueue={removeFromQueue}
        onClearQueue={clearQueue}
        onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
        onOpenYouTubeModal={handleOpenYouTube}
        onAddToPlaylist={handleOpenAddToPlaylist}
      />

      {/* 6. Sleep Timer Control Modal */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        currentSetting={sleepTimerSetting}
        remainingSeconds={sleepTimerRemaining}
        onSetTimer={(setting) => {
          setSleepTimer(setting);
          if (setting === 'end_of_track') {
            addToast('success', 'Waktu tidur: Berhenti di akhir lagu');
          } else if (typeof setting === 'number') {
            addToast('success', `Waktu tidur disetel: ${setting} menit`);
          }
        }}
        onCancelTimer={() => {
          cancelSleepTimer();
          addToast('info', 'Waktu tidur dinonaktifkan');
        }}
      />

      {/* 7. Queue Side Drawer */}
      <QueueDrawer
        isOpen={isQueueDrawerOpen}
        onClose={() => setIsQueueDrawerOpen(false)}
        queue={queue}
        queueIndex={queueIndex}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={(t, q) => handlePlayTrack(t, q)}
        onRemoveFromQueue={removeFromQueue}
      />

      {/* 8. Create / Edit Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => {
          setIsPlaylistModalOpen(false);
          setPlaylistToEdit(null);
        }}
        onSubmit={handleSavePlaylist}
        playlistToEdit={playlistToEdit}
      />

      {/* 9. Add Track to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => {
          setIsAddToPlaylistModalOpen(false);
          setTrackForAddToPlaylist(null);
        }}
        track={trackForAddToPlaylist}
        playlists={playlists}
        onAddTrackToPlaylist={handleAddTrack}
        onRemoveTrackFromPlaylist={removeTrackFromPlaylist}
        onOpenCreatePlaylist={() => {
          setIsAddToPlaylistModalOpen(false);
          setPlaylistToEdit(null);
          setIsPlaylistModalOpen(true);
        }}
      />

      {/* 10. YouTube Music Video/Full Playback Modal */}
      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => {
          setIsYouTubeModalOpen(false);
          setTrackForYouTube(null);
        }}
        track={trackForYouTube}
      />

      {/* 11. Reactive Feedback Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
