'use client'

import { useState, useEffect, useRef } from 'react'
import { musicService, Song } from '@/lib/supabase'

interface MusicPlayerProps {
  song: Song
  songs: Song[]
  onSongChange: (song: Song) => void
}

export default function MusicPlayer({ song, songs, onSongChange }: MusicPlayerProps) {  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off')
  const [isLoading, setIsLoading] = useState(true)
  const [wasPlaying, setWasPlaying] = useState(false) // Track if we were playing before song change
  
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
      }

      // Auto-play the new song if we were playing before
      const handleCanPlayThrough = () => {
        if (wasPlaying) {
          audio.play().then(() => {
            setIsPlaying(true)
          }).catch((error) => {
            console.log('Auto-play prevented:', error)
            setIsPlaying(false)
          })
        }
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

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }
  const playNext = () => {
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
  }

  const playPrevious = () => {
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
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value) / 100
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const toggleRepeat = () => {
    const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all']
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="music-player fixed-bottom bg-dark border-top shadow-lg">
      <audio ref={audioRef} />
      
      {/* Progress Bar */}
      <div className="progress-container p-2">
        <div className="d-flex justify-content-between small text-secondary mb-1">
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

      <div className="player-content p-3">
        <div className="row align-items-center">
          {/* Song Info */}
          <div className="col-4 col-md-3">
            <div className="d-flex align-items-center">
              <div className="song-artwork me-3">
                <i className="bi bi-music-note-beamed display-6 text-dark"></i>
              </div>
              <div className="song-info d-none d-md-block">
                <h6 className="song-title mb-0 text-white">{song.title}</h6>
                <small className="text-white">{song.artist || 'Unknown Artist'}</small>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="col-4 col-md-6">
            <div className="d-flex justify-content-center align-items-center">
              <button
                className="btn btn-link text-white me-2"
                onClick={toggleShuffle}
                title={isShuffled ? 'Karıştırma Açık' : 'Karıştırma Kapalı'}
              >
                <i className={`bi bi-shuffle ${isShuffled ? 'text-primary' : ''}`}></i>
              </button>

              <button
                className="btn btn-link text-white me-3"
                onClick={playPrevious}
                title="Önceki"
              >
                <i className="bi bi-skip-start-fill"></i>
              </button>

              <button
                className="btn btn-primary btn-lg rounded-circle me-3"
                onClick={togglePlay}
                disabled={isLoading}
                title={isPlaying ? 'Duraklat' : 'Çal'}
              >
                {isLoading ? (
                  <i className="bi bi-hourglass-split"></i>
                ) : isPlaying ? (
                  <i className="bi bi-pause-fill"></i>
                ) : (
                  <i className="bi bi-play-fill"></i>
                )}
              </button>

              <button
                className="btn btn-link text-white me-2"
                onClick={playNext}
                title="Sonraki"
              >
                <i className="bi bi-skip-end-fill"></i>
              </button>

              <button
                className="btn btn-link text-white"
                onClick={toggleRepeat}
                title={
                  repeatMode === 'off' ? 'Tekrar Kapalı' :
                  repeatMode === 'one' ? 'Bir Şarkı Tekrar' :
                  'Tüm Liste Tekrar'
                }
              >
                <i className={`bi ${
                  repeatMode === 'off' ? 'bi-repeat' :
                  repeatMode === 'one' ? 'bi-repeat-1' :
                  'bi-repeat'
                } ${repeatMode !== 'off' ? 'text-primary' : ''}`}></i>
              </button>
            </div>
          </div>

          {/* Volume */}
          <div className="col-4 col-md-3">
            <div className="d-flex justify-content-end align-items-center">
              <button
                className="btn btn-link text-white me-2"
                onClick={toggleMute}
                title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
              >
                <i className={`bi ${
                  isMuted || volume === 0 ? 'bi-volume-mute' :
                  volume < 0.5 ? 'bi-volume-down' :
                  'bi-volume-up'
                }`}></i>
              </button>
              <input
                type="range"
                className="form-range d-none d-md-block"
                style={{ width: '80px' }}
                min="0"
                max="100"
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .music-player {
          z-index: 1050;
          max-height: 150px;
        }
        
        .song-artwork {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        
        .song-title {
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .btn-link {
          padding: 0.25rem 0.5rem;
          border: none;
          background: none;
        }
        
        .btn-primary.btn-lg {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .song-info {
            display: none !important;
          }
          
          .btn-link {
            padding: 0.1rem 0.25rem;
            font-size: 0.9rem;
          }
          
          .btn-primary.btn-lg {
            width: 45px;
            height: 45px;
          }
        }
      `}</style>
    </div>
  )
}
