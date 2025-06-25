'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import MusicPlayer from '@/components/MusicPlayer'
import SongUpload from '@/components/SongUpload'
import SongList from '@/components/SongList'
import { musicService, Song } from '@/lib/supabase'
import { handleError, isSupabaseConfigured, AppError } from '@/lib/errors'

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isUserInteraction, setIsUserInteraction] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    loadSongs()
  }, [])

  const loadSongs = async () => {
    try {
      setError(null)
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase configuration is missing')
      }

      const fetchedSongs = await musicService.getAllSongs()
      setSongs(fetchedSongs)
    } catch (error) {
      console.error('Failed to load songs:', error)
      const appError = handleError(error)
      setError(appError)
    } finally {
      setIsLoading(false)
    }
  }
  const handleSongUploaded = (newSong: Song) => {
    setSongs(prev => [newSong, ...prev])
    setError(null) // Clear any previous errors
  }
    const handlePlaySong = async (song: Song) => {
    setCurrentSong(song)
    setIsUserInteraction(true)
    
    // Keep user interaction flag longer to ensure MusicPlayer catches it
    if (song.id !== currentSong?.id) {
      setTimeout(() => setIsUserInteraction(false), 200) // 200ms - enough time for useEffect
    }
  }

  const handleSongChange = (song: Song) => {
    // Şarkı değişimi (next/previous) de user interaction olarak say
    setCurrentSong(song) 
    setIsUserInteraction(true)
    setTimeout(() => setIsUserInteraction(false), 500) // 500ms - daha kısa
  }

  const retryLoadSongs = () => {
    setIsLoading(true)
    loadSongs()
  }

  return (
    <div className="container-fluid p-0" style={{backgroundColor: '#1e1e1e', minHeight: '100vh'}}>
      {/* Header */}
      <nav className="navbar navbar-dark sticky-top" style={{backgroundColor: '#2a2a2a'}}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center">
            <Image src="/icon.png" alt="Play Aura" width={32} height={32} />
          </span>
        </div>
      </nav>

      <div className="container-fluid" style={{backgroundColor: '#1e1e1e'}}>
        <div className="row">
          {/* Main Content */}
          <div className="col-12">
            {/* Error Display */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                <div className="d-flex align-items-start">
                  <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
                  <div className="flex-grow-1">
                    <strong>{error.message}</strong>
                    {error.details && (
                      <div className="small mt-1 opacity-75">{error.details}</div>
                    )}
                    {error.code === 'TABLE_NOT_FOUND' && (
                      <div className="mt-2">
                        <small className="opacity-75">
                          Çözüm: Supabase dashboard&apos;da SQL Editor&apos;ü açın ve <code>supabase/init.sql</code> dosyasındaki komutları çalıştırın.
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={retryLoadSongs}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Tekrar Dene
                    </button>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setError(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Section */}
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title text-white">
                  <i className="bi bi-cloud-upload me-2 text-primary"></i>
                  Müzik Yükle
                </h5>
                <SongUpload onSongUploaded={handleSongUploaded} />
              </div>
            </div>

            {/* Song List */}
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title text-white">
                  <i className="bi bi-music-note-list me-2 text-primary"></i>
                  Müzik Listesi ({songs.length})
                </h5>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                  </div>
                ) : (
                  <SongList 
                    songs={songs}
                    currentSong={currentSong}
                    onPlaySong={handlePlaySong}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Music Player - Fixed Bottom */}
      {currentSong && (
        <MusicPlayer 
          song={currentSong}
          songs={songs}
          onSongChange={handleSongChange}
          isUserInteraction={isUserInteraction}
        />
      )}
    </div>
  )
}
