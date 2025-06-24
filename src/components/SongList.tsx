'use client'

import { useState } from 'react'
import { musicService, Song } from '@/lib/supabase'

interface SongListProps {
  songs: Song[]
  currentSong: Song | null
  onPlaySong: (song: Song) => void
  onDeleteSong: (songId: string) => void
}

export default function SongList({ songs, currentSong, onPlaySong, onDeleteSong }: SongListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (song: Song) => {
    if (!confirm(`"${song.title}" adlı şarkıyı silmek istediğinizden emin misiniz?`)) {
      return
    }

    setDeletingId(song.id)
    try {
      await musicService.deleteSong(song.id)
      onDeleteSong(song.id)
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Silme işlemi başarısız oldu.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-music-note display-1 text-muted"></i>
        <h5 className="mt-3 text-muted">Henüz müzik yüklenmemiş</h5>
        <p className="text-muted">Yukarıdaki yükleme alanını kullanarak MP3 dosyalarınızı ekleyin.</p>
      </div>
    )
  }

  return (
    <div className="song-list">
      {songs.map((song) => (
        <div 
          key={song.id} 
          className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
        >
          <div className="song-info" onClick={() => onPlaySong(song)}>
            <div className="song-icon">
              {currentSong?.id === song.id ? (
                <i className="bi bi-play-circle-fill text-primary"></i>
              ) : (
                <i className="bi bi-music-note-beamed"></i>
              )}
            </div>
            <div className="song-details">
              <h6 className="song-title mb-1">{song.title}</h6>
              <p className="song-artist text-muted mb-0">{song.artist || 'Unknown Artist'}</p>              <small className="text-muted">
                {song.duration && song.duration > 0 && `${formatDuration(song.duration)} • `}
                {formatFileSize(song.file_size)}
              </small>
            </div>
          </div>
          
          <div className="song-actions">
            <button
              className="btn btn-sm btn-outline-dark me-2"
              onClick={() => onPlaySong(song)}
              title="Çal"
            >
              <i className="bi bi-play-fill"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(song)}
              disabled={deletingId === song.id}
              title="Sil"
            >
              {deletingId === song.id ? (
                <i className="bi bi-hourglass-split"></i>
              ) : (
                <i className="bi bi-trash"></i>
              )}
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        .song-list {
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .song-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
          transition: background-color 0.2s ease;
        }
        
        .song-item:hover {
          background-color:rgb(255, 245, 231);
        }
        
        .song-item.active {
          background-color:rgb(255, 245, 231);
          border-color:rgb(253, 133, 13);
        }
        
        .song-info {
          display: flex;
          align-items: center;
          flex: 1;
          cursor: pointer;
        }
        
        .song-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          color: #6c757d;
        }
        
        .song-details {
          flex: 1;
        }
        
        .song-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .song-artist {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .song-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .song-item {
            padding: 0.75rem;
          }
          
          .song-icon {
            margin-right: 0.75rem;
          }
          
          .song-actions {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  )
}
