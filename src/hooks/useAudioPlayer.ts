import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, RepeatMode } from '../types/music';
import { refreshTrackPreview, resolveTrackVideoId } from '../services/musicApi';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const currentTrackRef = useRef<Track | null>(null);

  // YouTube Engine Refs
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const activeEngineRef = useRef<'html5' | 'youtube'>('youtube');
  const pendingVideoIdRef = useRef<string | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [youtubeMode, setYoutubeMode] = useState<boolean>(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // Sync currentTrack ref
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  // Forward ref declaration for playNext so handlers can call it
  const playNextRef = useRef<() => void>(() => {});

  // Web Audio Analyser for spectrum visualizer
  const initAudioAnalyser = useCallback(() => {
    if (!audioRef.current || analyserRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch (e) {
      // Ignore if already connected or blocked
    }
  }, []);

  const resumeAudioContext = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
  }, []);

  const getFrequencyData = useCallback((array: Uint8Array) => {
    if (analyserRef.current && activeEngineRef.current === 'html5') {
      try {
        analyserRef.current.getByteFrequencyData(array as any);
      } catch {
        // Fallback handled in visualizer component
      }
    }
  }, []);

  // Safe HTML5 Play & Pause
  const safePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    initAudioAnalyser();
    resumeAudioContext();
    setIsLoading(true);

    const promise = audio.play();
    playPromiseRef.current = promise;

    promise
      .then(() => {
        playPromiseRef.current = null;
        setIsPlaying(true);
        setIsLoading(false);
        setPlayerError(null);
      })
      .catch((err: any) => {
        playPromiseRef.current = null;
        if (err.name === 'AbortError') return;
        setIsPlaying(false);
        setIsLoading(false);
      });
  }, [initAudioAnalyser, resumeAudioContext]);

  const safePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          audio.pause();
          setIsPlaying(false);
          setIsLoading(false);
        })
        .catch(() => {
          audio.pause();
          setIsPlaying(false);
          setIsLoading(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  // Initialize YouTube IFrame Player in a persistent off-screen host
  useEffect(() => {
    let hostElement = document.getElementById('innertube-audio-player-host');
    if (!hostElement) {
      hostElement = document.createElement('div');
      hostElement.id = 'innertube-audio-player-host';
      hostElement.style.position = 'fixed';
      hostElement.style.width = '240px';
      hostElement.style.height = '140px';
      hostElement.style.left = '-9999px';
      hostElement.style.bottom = '0px';
      hostElement.style.opacity = '0';
      hostElement.style.pointerEvents = 'none';
      hostElement.style.zIndex = '-999';
      document.body.appendChild(hostElement);
    }

    const initYt = () => {
      if (ytPlayerRef.current || !window.YT || !window.YT.Player) return;

      try {
        ytPlayerRef.current = new window.YT.Player('innertube-audio-player-host', {
          height: '140',
          width: '240',
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              isYtReadyRef.current = true;
              event.target.setVolume(volume * 100);
              if (pendingVideoIdRef.current) {
                const vid = pendingVideoIdRef.current;
                pendingVideoIdRef.current = null;
                event.target.loadVideoById({ videoId: vid, startSeconds: 0 });
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
              if (event.data === 1) {
                setIsPlaying(true);
                setIsLoading(false);
                setPlayerError(null);
                const d = event.target.getDuration();
                if (d && !isNaN(d) && d > 0) {
                  setDuration(d);
                }
              } else if (event.data === 2) {
                setIsPlaying(false);
                setIsLoading(false);
              } else if (event.data === 3) {
                setIsLoading(true);
              } else if (event.data === 0) {
                // Auto play next song without pause or manual action
                playNextRef.current();
              }
            },
            onError: (event: any) => {
              console.warn('YouTube Player API Error code:', event.data);
              setIsLoading(false);
              // Fallback to HTML5 audio preview if available
              if (currentTrackRef.current?.previewUrl && audioRef.current) {
                activeEngineRef.current = 'html5';
                audioRef.current.src = currentTrackRef.current.previewUrl;
                safePlay();
              } else {
                setPlayerError('Video ini memiliki pembatasan embed. Anda dapat membukanya lewat tombol YouTube.');
              }
            }
          }
        });
      } catch (e) {
        console.warn('YT Player init exception:', e);
      }
    };

    if (window.YT && window.YT.Player) {
      initYt();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        initYt();
      };
    }
  }, [safePlay, volume]);

  // Polling YouTube player elapsed time and duration
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && activeEngineRef.current === 'youtube' && ytPlayerRef.current) {
      timer = setInterval(() => {
        try {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
            const cur = ytPlayerRef.current.getCurrentTime();
            if (typeof cur === 'number' && !isNaN(cur)) {
              setCurrentTime(cur);
            }
            const dur = ytPlayerRef.current.getDuration();
            if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
              setDuration(dur);
            }
          }
        } catch {
          // Ignore polling errors during track switch
        }
      }, 300);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Initialize HTML5 Audio element ONCE on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (activeEngineRef.current === 'html5') {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      if (activeEngineRef.current === 'html5' && audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handlePlaying = () => {
      if (activeEngineRef.current === 'html5') {
        setIsPlaying(true);
        setIsLoading(false);
        setPlayerError(null);
      }
    };

    const handlePause = () => {
      if (activeEngineRef.current === 'html5') {
        setIsPlaying(false);
      }
    };

    const handleAudioError = async () => {
      if (activeEngineRef.current !== 'html5') return;
      setIsLoading(false);
      setIsPlaying(false);

      const track = currentTrackRef.current;
      if (track) {
        // Try resolving to full YouTube playback
        const vid = await resolveTrackVideoId(track);
        if (vid && ytPlayerRef.current && isYtReadyRef.current) {
          activeEngineRef.current = 'youtube';
          ytPlayerRef.current.loadVideoById({ videoId: vid, startSeconds: 0 });
          ytPlayerRef.current.playVideo();
          return;
        }

        const freshUrl = await refreshTrackPreview(track);
        if (freshUrl && freshUrl !== audio.src) {
          track.previewUrl = freshUrl;
          audio.src = freshUrl;
          safePlay();
          return;
        }
      }
      setPlayerError('Pratinjau audio sedang tidak tersedia.');
    };

    const handleEnded = () => {
      if (activeEngineRef.current === 'html5') {
        playNextRef.current();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleAudioError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      safePause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleAudioError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [safePlay, safePause]);

  // Main Play Function: Plays FULL SONG via YouTube Engine (or falls back seamlessly)
  const playTrack = useCallback(async (track: Track, newQueue?: Track[]) => {
    currentTrackRef.current = track;
    setCurrentTrack(track);
    setIsLoading(true);
    setPlayerError(null);
    setCurrentTime(0);
    setDuration(track.duration || 180);

    // Queue synchronization
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const index = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(index !== -1 ? index : 0);
    } else {
      setQueue(prev => {
        const idx = prev.findIndex(t => t.id === track.id);
        if (idx === -1) {
          const updated = [...prev, track];
          setQueueIndex(updated.length - 1);
          return updated;
        } else {
          setQueueIndex(idx);
          return prev;
        }
      });
    }

    // Stop any ongoing HTML5 audio
    safePause();

    // 1. Resolve full videoId to play full 30-min mix / full song without 30-sec limit
    let videoId = track.videoId;
    if (!videoId) {
      videoId = await resolveTrackVideoId(track) || undefined;
    }

    if (videoId) {
      activeEngineRef.current = 'youtube';
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.loadVideoById({ videoId, startSeconds: 0 });
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          setIsLoading(false);
          return;
        } catch (e) {
          console.warn('Gagal memuat video YouTube:', e);
        }
      } else {
        // Player is still initializing; queue it
        pendingVideoIdRef.current = videoId;
        setIsLoading(true);
        return;
      }
    }

    // 2. Fallback to HTML5 audio preview if videoId couldn't be resolved
    if (track.previewUrl && audioRef.current) {
      activeEngineRef.current = 'html5';
      audioRef.current.src = track.previewUrl;
      audioRef.current.currentTime = 0;
      safePlay();
    } else {
      // Auto-try refreshing preview
      refreshTrackPreview(track).then(fresh => {
        if (fresh && audioRef.current) {
          track.previewUrl = fresh;
          activeEngineRef.current = 'html5';
          audioRef.current.src = fresh;
          safePlay();
        } else {
          setYoutubeMode(true);
          setIsLoading(false);
        }
      });
    }
  }, [safePlay, safePause]);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!currentTrack) return;

    if (activeEngineRef.current === 'youtube' && ytPlayerRef.current && isYtReadyRef.current) {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        safePause();
      } else {
        safePlay();
      }
    }
  }, [isPlaying, currentTrack, safePlay, safePause]);

  // Next Track
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    if (repeatMode === 'one' && currentTrack) {
      if (activeEngineRef.current === 'youtube' && ytPlayerRef.current) {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
        safePlay();
      }
      return;
    }

    let nextIdx = queueIndex + 1;

    if (isShuffle) {
      if (queue.length > 1) {
        do {
          nextIdx = Math.floor(Math.random() * queue.length);
        } while (nextIdx === queueIndex);
      }
    }

    if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        if (activeEngineRef.current === 'youtube' && ytPlayerRef.current) {
          ytPlayerRef.current.pauseVideo();
        } else {
          safePause();
        }
        setIsPlaying(false);
        return;
      }
    }

    const nextTrack = queue[nextIdx];
    if (nextTrack) {
      setQueueIndex(nextIdx);
      playTrack(nextTrack, queue);
    }
  }, [queue, queueIndex, isShuffle, repeatMode, currentTrack, playTrack, safePlay, safePause]);

  // Keep playNextRef up to date
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  // Previous Track
  const playPrev = useCallback(() => {
    if (currentTime > 3) {
      if (activeEngineRef.current === 'youtube' && ytPlayerRef.current) {
        ytPlayerRef.current.seekTo(0, true);
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setCurrentTime(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }

    const prevTrack = queue[prevIdx];
    if (prevTrack) {
      setQueueIndex(prevIdx);
      playTrack(prevTrack, queue);
    }
  }, [currentTime, queue, queueIndex, playTrack]);

  // Seek
  const seek = useCallback((time: number) => {
    setCurrentTime(time);
    if (activeEngineRef.current === 'youtube' && ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.seekTo(time, true);
      } catch (e) {
        console.warn('Seek YT failed:', e);
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // Set Volume
  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);

    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.setVolume(clamped * 100);
        if (clamped > 0 && isMuted) {
          setIsMuted(false);
          ytPlayerRef.current.unMute();
        }
      } catch {}
    }

    if (audioRef.current) {
      audioRef.current.volume = clamped;
      if (clamped > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        if (newMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
        }
      } catch {}
    }

    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  }, [isMuted]);

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  // Cycle Repeat Mode
  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Add to Queue
  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  // Remove from Queue
  const removeFromQueue = useCallback((indexToRemove: number) => {
    setQueue(prev => {
      const nextQ = prev.filter((_, idx) => idx !== indexToRemove);
      if (indexToRemove === queueIndex) {
        if (nextQ.length > 0) {
          const newIdx = Math.min(queueIndex, nextQ.length - 1);
          setQueueIndex(newIdx);
          playTrack(nextQ[newIdx], nextQ);
        } else {
          setCurrentTrack(null);
          setIsPlaying(false);
          setQueueIndex(-1);
          safePause();
          if (ytPlayerRef.current) {
            ytPlayerRef.current.stopVideo();
          }
        }
      } else if (indexToRemove < queueIndex) {
        setQueueIndex(prevIdx => prevIdx - 1);
      }
      return nextQ;
    });
  }, [queueIndex, playTrack, safePause]);

  return {
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
    activeEngine: activeEngineRef.current,
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
    addToQueue,
    removeFromQueue,
    setQueue,
    getFrequencyData
  };
}
