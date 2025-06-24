'use client'

import { useState, useEffect } from 'react'
import MusicPlayer from '@/components/MusicPlayer'
import SongUpload from '@/components/SongUpload'
import SongList from '@/components/SongList'
import DatabaseTest from '@/components/DatabaseTest'
import DetailedStorageTest from '@/components/DetailedStorageTest'
import ConnectionVerifier from '@/components/ConnectionVerifier'
import { musicService, Song } from '@/lib/supabase'
import { handleError, isSupabaseConfigured, AppError } from '@/lib/errors'

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)
  const [showDebug, setShowDebug] = useState(false)

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

  const handleSongDeleted = (deletedSongId: string) => {
    setSongs(prev => prev.filter(song => song.id !== deletedSongId))
    if (currentSong?.id === deletedSongId) {
      setCurrentSong(null)
    }
  }

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song)
  }

  const retryLoadSongs = () => {
    setIsLoading(true)
    loadSongs()
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-music-note-beamed me-2"></i>
            Orange
          </span>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Main Content */}
          <div className="col-12">
            {/* Error Display */}
            {error && (
              <div className="alert alert-warning alert-dismissible fade show mt-3" role="alert">
                <div className="d-flex align-items-start">
                  <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
                  <div className="flex-grow-1">
                    <strong>{error.message}</strong>
                    {error.details && (
                      <div className="small text-muted mt-1">{error.details}</div>
                    )}
                    {error.code === 'TABLE_NOT_FOUND' && (
                      <div className="mt-2">
                        <small className="text-muted">
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
                      className="btn-close"
                      onClick={() => setError(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              </div>
            )}

            {/* Debug Toggle */}
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowDebug(!showDebug)}
              >
                <i className="bi bi-gear me-1"></i>
                {showDebug ? 'Hide' : 'Show'} Debug Tools
              </button>
            </div>

            {/* Debug Panel */}
            {showDebug && (
              <>
                <ConnectionVerifier />
                <DatabaseTest />
                <DetailedStorageTest />
              </>
            )}

            {/* Upload Section */}
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-cloud-upload me-2"></i>
                  Müzik Yükle
                </h5>
                <SongUpload onSongUploaded={handleSongUploaded} />
              </div>
            </div>

            {/* Song List */}
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-music-note-list me-2"></i>
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
                    onDeleteSong={handleSongDeleted}
                  />
                )}
              </div>
            </div>

            {/* Debug Section - Remove in Production */}
            {showDebug && (
              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-bug me-2"></i>
                    Debug Bilgileri
                  </h5>
                  <DatabaseTest />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Music Player - Fixed Bottom */}
      {currentSong && (
        <MusicPlayer 
          song={currentSong}
          songs={songs}
          onSongChange={setCurrentSong}
        />
      )}
    </div>
  )
}
