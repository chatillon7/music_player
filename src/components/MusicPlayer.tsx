'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { musicService, Song } from '@/lib/supabase'

interface MusicPlayerProps {
  song: Song
  songs: Song[]
  onSongChange: (song: Song) => void
}

export default function MusicPlayer({ song, songs, onSongChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off')
  const [isLoading, setIsLoading] = useState(true)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  
  useEffect(() => {
    if (audioRef.current && song) {
      const audio = audioRef.current
      const songUrl = musicService.getPublicUrl(song.file_path)
      
      // Remember if we were playing before changing songs
      setWasPlaying(isPlaying)
      
      audio.src = songUrl
      setIsLoading(true)
      setCurrentTime(0)
        // Set up media session for background playback
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.artist || 'Unknown Artist',
          album: 'Music Player',
        })
        
        // Set up media session action handlers
        navigator.mediaSession.setActionHandler('play', () => {
          if (audioRef.current) {
            audioRef.current.play()
            setIsPlaying(true)
          }
        })
          navigator.mediaSession.setActionHandler('pause', () => {
          if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
          }
        })
        
        // Media session handlers for previous/next will be set up after functions are defined
        
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (audioRef.current && details.seekTime) {
            audioRef.current.currentTime = details.seekTime
            setCurrentTime(details.seekTime)
          }
        })
      }// Auto-play the new song (always start when a song is selected)
      const handleCanPlayThrough = () => {
        audio.play().then(() => {
          setIsPlaying(true)
        }).catch((error) => {
          console.log('Auto-play prevented:', error)
          setIsPlaying(false)
        })
        audio.removeEventListener('canplaythrough', handleCanPlayThrough)
      }

      audio.addEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [song]) // Remove isPlaying and wasPlaying from dependencies to avoid loops
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      } else if (repeatMode === 'all' || songs.length > 1) {
        playNext()
      } else {
        setIsPlaying(false)
      }
    }
    const handleCanPlay = () => setIsLoading(false)
    const handleWaiting = () => setIsLoading(true)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('waiting', handleWaiting)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('waiting', handleWaiting)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatMode, songs.length])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying])
  
  const playNext = useCallback(() => {
    const currentIndex = songs.findIndex(s => s.id === song.id)
    let nextIndex

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songs.length)
    } else {
      nextIndex = (currentIndex + 1) % songs.length
    }

    // Remember that we want to continue playing
    setWasPlaying(isPlaying)
    onSongChange(songs[nextIndex])
  }, [songs, song.id, isShuffled, isPlaying, onSongChange])
  const playPrevious = useCallback(() => {
    const currentIndex = songs.findIndex(s => s.id === song.id)
    let prevIndex

    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * songs.length)
    } else {
      prevIndex = (currentIndex - 1 + songs.length) % songs.length
    }

    // Remember that we want to continue playing
    setWasPlaying(isPlaying)
    onSongChange(songs[prevIndex])
  }, [songs, song.id, isShuffled, isPlaying, onSongChange])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }
  
  const toggleRepeat = (e: React.MouseEvent) => {
    e.preventDefault()
    const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all']
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  // Keyboard media keys support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior and handle media keys
      switch (event.code) {
        case 'MediaPlayPause':
          event.preventDefault()
          togglePlay()
          break
        case 'MediaTrackNext':
          event.preventDefault()
          playNext()
          break
        case 'MediaTrackPrevious':
          event.preventDefault()
          playPrevious()
          break
        case 'MediaStop':
          event.preventDefault()
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            setIsPlaying(false)
            setCurrentTime(0)
          }
          break
      }
    }

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [togglePlay, playNext, playPrevious]) // Add function dependencies
  // Set up Media Session API handlers after functions are defined
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        const currentIndex = songs.findIndex(s => s.id === song.id)
        let prevIndex
        
        if (isShuffled) {
          prevIndex = Math.floor(Math.random() * songs.length)
        } else {
          prevIndex = (currentIndex - 1 + songs.length) % songs.length
        }
        
        onSongChange(songs[prevIndex])
      })
      
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        const currentIndex = songs.findIndex(s => s.id === song.id)
        let nextIndex
        
        if (isShuffled) {
          nextIndex = Math.floor(Math.random() * songs.length)
        } else {
          nextIndex = (currentIndex + 1) % songs.length
        }
        
        onSongChange(songs[nextIndex])
      })
    }
  }, [songs, song.id, isShuffled, onSongChange])

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    callback()
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
  
  return (
    <div className="music-player fixed-bottom shadow-lg" style={{backgroundColor: '#2a2a2a'}}>
      <audio ref={audioRef} />
      
      {/* Progress Bar */}
      <div className="progress-container p-2" style={{backgroundColor: '#2a2a2a'}}>
        <div className="d-flex justify-content-between small text-secondary">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={progressPercentage}
          onChange={handleSeek}
        />
      </div>

      <div className="player-content px-3 mb-3 mb-md-3" style={{backgroundColor: '#2a2a2a'}}>        <div className="row align-items-center">
          {/* Song Info */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">              <div className="song-artwork me-3 d-none d-md-block">
                <i className="bi bi-music-note-beamed display-6 text-primary"></i>
              </div>
              <div className="song-info text-center text-md-start">
                <h6 className="song-title mb-0 text-white">{song.title}</h6>
                <small className="text-white">{song.artist || 'Unknown Artist'}</small>
              </div>
            </div>
          </div>          {/* Controls - Centered */}
          <div className="col-12 col-md-6"><div className="d-flex justify-content-center align-items-center gap-2 gap-md-3">
              <button
                className="btn btn-link text-white control-btn"
                onClick={handleButtonClick(toggleShuffle)}
                title={isShuffled ? 'Shuffle On' : 'Shuffle Off'}
                type="button"
              >
                <i className={`bi bi-shuffle fs-5 ${isShuffled ? 'text-primary' : ''}`}></i>
              </button>

              <button
                className="btn btn-link text-white control-btn"
                onClick={handleButtonClick(playPrevious)}
                title="Previous"
                type="button"
              >
                <i className="bi bi-skip-start-fill fs-5"></i>
              </button>              <button
                className="btn btn-primary btn-lg rounded-circle play-btn"
                onClick={handleButtonClick(togglePlay)}
                disabled={isLoading}
                title={isPlaying ? 'Pause' : 'Play'}
                type="button"
              >
                {isLoading ? (
                  <i className="bi bi-hourglass-split fs-4 text-white"></i>
                ) : isPlaying ? (
                  <i className="bi bi-pause-fill fs-4 text-white"></i>
                ) : (
                  <i className="bi bi-play-fill fs-4 text-white"></i>
                )}
              </button>

              <button
                className="btn btn-link text-white control-btn"
                onClick={handleButtonClick(playNext)}
                title="Next"
                type="button"
              >
                <i className="bi bi-skip-end-fill fs-5"></i>
              </button>

              <button
                className="btn btn-link text-white control-btn"
                onClick={toggleRepeat}
                title={
                  repeatMode === 'off' ? 'Repeat Off' :
                  repeatMode === 'one' ? 'Repeat One' :
                  'Repeat All'
                }
                type="button"
              >
                <i className={`bi ${
                  repeatMode === 'off' ? 'bi-repeat' :
                  repeatMode === 'one' ? 'bi-repeat-1' :
                  'bi-repeat'
                } fs-5 ${repeatMode !== 'off' ? 'text-primary' : ''}`}></i>              </button>
            </div>
          </div>

          {/* Right spacer for desktop balance */}
          <div className="col-3 d-none d-md-block"></div>
        </div>
      </div>      <style jsx>{`
        .music-player {
          z-index: 1050;
          max-height: 150px;
          border-top: 1px solid #404040 !important;
        }.song-artwork {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--background-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        
        .song-title {
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .control-btn {
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }
        
        .control-btn:hover,
        .control-btn:focus {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .control-btn:active {
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(0.95);
        }
        
        .play-btn {
          min-width: 56px;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s ease;
        }
        
        .play-btn:active {
          transform: scale(0.95);
        }
        
        /* Ensure consistent spacing on all screen sizes */
        .gap-2 {
          gap: 0.5rem !important;
        }
        
        .gap-md-3 {
          gap: 1rem !important;
        }
          @media (max-width: 768px) {
          .music-player {
            max-height: 180px;
          }
          
          .control-btn {
            min-width: 44px;
            min-height: 44px;
            font-size: 1.1rem;
          }
          
          .play-btn {
            min-width: 50px;
            min-height: 50px;
          }
          
          /* Ensure proper spacing on mobile */
          .gap-2 {
            gap: 0.25rem !important;
          }
          
          .song-info {
            font-size: 0.8rem;
          }
          
          .song-title {
            font-size: 0.8rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .control-btn {
            min-width: 40px;
            min-height: 40px;
          }
          
          .play-btn {
            min-width: 48px;
            min-height: 48px;
          }
        }
      `}</style>
    </div>
  )
}
