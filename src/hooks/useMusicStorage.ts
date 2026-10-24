import { useState, useEffect, useCallback } from 'react';
import { Playlist, Track } from '../types/music';
import { DEFAULT_PLAYLISTS, DEFAULT_FEATURED_TRACKS } from '../data/defaultCatalog';

const PLAYLISTS_STORAGE_KEY = 'aurora_sound_custom_playlists_v1';
const LIKED_STORAGE_KEY = 'aurora_sound_liked_tracks_v1';

export const GRADIENT_OPTIONS = [
  { id: 'emerald-teal', label: 'Aurora Emerald', value: 'from-emerald-500/80 via-teal-600/70 to-indigo-950/90' },
  { id: 'violet-purple', label: 'Cyber Violet', value: 'from-violet-600/80 via-purple-700/70 to-slate-950/90' },
  { id: 'cyan-blue', label: 'Electric Blue', value: 'from-cyan-500/80 via-blue-700/70 to-purple-950/90' },
  { id: 'rose-ruby', label: 'Ruby Velvet', value: 'from-rose-600/80 via-pink-700/70 to-slate-950/90' },
  { id: 'amber-orange', label: 'Solar Sunset', value: 'from-amber-500/80 via-orange-600/70 to-slate-950/90' },
  { id: 'fuchsia-indigo', label: 'Neon Twilight', value: 'from-fuchsia-600/80 via-indigo-600/70 to-slate-950/90' }
];

export function useMusicStorage() {
  // Initialize playlists from localStorage or default
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca playlist dari localStorage:', e);
    }
    return DEFAULT_PLAYLISTS;
  });

  // Initialize liked tracks from localStorage or default
  const [likedTracks, setLikedTracks] = useState<Track[]>(() => {
    try {
      const stored = localStorage.getItem(LIKED_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca lagu yang disukai dari localStorage:', e);
    }
    return [DEFAULT_FEATURED_TRACKS[0], DEFAULT_FEATURED_TRACKS[2]];
  });

  // Save playlists on change
  useEffect(() => {
    try {
      localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    } catch (e) {
      console.error('Gagal menyimpan playlist ke localStorage:', e);
    }
  }, [playlists]);

  // Save liked tracks on change
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedTracks));
    } catch (e) {
      console.error('Gagal menyimpan lagu yang disukai ke localStorage:', e);
    }
  }, [likedTracks]);

  // Check if a track is liked
  const isLiked = useCallback((trackId: string) => {
    return likedTracks.some(t => t.id === trackId);
  }, [likedTracks]);

  // Toggle like track
  const toggleLikeTrack = useCallback((track: Track) => {
    setLikedTracks(prev => {
      const exists = prev.some(t => t.id === track.id);
      if (exists) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [track, ...prev];
      }
    });
  }, []);

  // Create new playlist
  const createPlaylist = useCallback((name: string, description: string = '', coverGradient?: string): Playlist => {
    const trimmedName = name.trim() || 'Playlist Baru';
    const gradient = coverGradient || GRADIENT_OPTIONS[Math.floor(Math.random() * GRADIENT_OPTIONS.length)].value;
    
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      description: description.trim() || 'Playlist kustom di Aurora Sound.',
      coverGradient: gradient,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tracks: []
    };

    setPlaylists(prev => [newPlaylist, ...prev]);
    return newPlaylist;
  }, []);

  // Update playlist info
  const updatePlaylist = useCallback((id: string, updates: Partial<Pick<Playlist, 'name' | 'description' | 'coverGradient'>>) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: Date.now()
        };
      }
      return p;
    }));
  }, []);

  // Delete playlist
  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }, []);

  // Add track to a playlist (prevent duplicates or allow toggle)
  const addTrackToPlaylist = useCallback((playlistId: string, track: Track): boolean => {
    let added = false;
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        // Prevent adding identical track twice
        const alreadyIn = p.tracks.some(t => t.id === track.id);
        if (!alreadyIn) {
          added = true;
          return {
            ...p,
            updatedAt: Date.now(),
            tracks: [...p.tracks, track]
          };
        }
      }
      return p;
    }));
    return added;
  }, []);

  // Remove track from playlist
  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return {
          ...p,
          updatedAt: Date.now(),
          tracks: p.tracks.filter(t => t.id !== trackId)
        };
      }
      return p;
    }));
  }, []);

  // Reorder tracks inside playlist
  const reorderPlaylistTracks = useCallback((playlistId: string, fromIndex: number, toIndex: number) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const newTracks = [...p.tracks];
        const [moved] = newTracks.splice(fromIndex, 1);
        newTracks.splice(toIndex, 0, moved);
        return {
          ...p,
          updatedAt: Date.now(),
          tracks: newTracks
        };
      }
      return p;
    }));
  }, []);

  // Export all playlists and liked tracks to a JSON file
  const exportLibraryAsJSON = useCallback(() => {
    const backupData = {
      app: 'Aurora Sound',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      playlists,
      likedTracks
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurora_sound_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [playlists, likedTracks]);

  // Import JSON backup data
  const importLibraryFromJSON = useCallback((jsonString: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Format file JSON tidak valid.' };
      }

      let importedPlaylistsCount = 0;
      let importedLikedCount = 0;

      if (Array.isArray(data.playlists)) {
        // Merge without overwriting with invalid data
        setPlaylists(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const validImported = data.playlists.filter((p: any) => p && p.id && p.name && Array.isArray(p.tracks));
          const newToAdd = validImported.filter((p: Playlist) => !existingIds.has(p.id));
          importedPlaylistsCount = newToAdd.length;
          return [...prev, ...newToAdd];
        });
      }

      if (Array.isArray(data.likedTracks)) {
        setLikedTracks(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const validImported = data.likedTracks.filter((t: any) => t && t.id && t.title);
          const newToAdd = validImported.filter((t: Track) => !existingIds.has(t.id));
          importedLikedCount = newToAdd.length;
          return [...prev, ...newToAdd];
        });
      }

      return {
        success: true,
        message: `Berhasil mengimpor ${importedPlaylistsCount} playlist baru dan ${importedLikedCount} lagu favorit!`
      };
    } catch (err) {
      return { success: false, message: 'Gagal memproses file JSON. Pastikan file backup valid.' };
    }
  }, []);

  return {
    playlists,
    likedTracks,
    isLiked,
    toggleLikeTrack,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks,
    exportLibraryAsJSON,
    importLibraryFromJSON
  };
}
