'use client'

import { Song } from '@/lib/supabase'

interface SongListProps {
  songs: Song[]
  currentSong: Song | null
  onPlaySong: (song: Song) => void
}

export default function SongList({ songs, currentSong, onPlaySong }: SongListProps) {

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-music-note display-1 text-primary"></i>
        <h5 className="mt-3 text-white">Henüz müzik yüklenmemiş</h5>
        <p style={{color: '#8e8e93'}}>Yukarıdaki yükleme alanını kullanarak MP3 dosyalarınızı ekleyin.</p>
      </div>
    )
  }

  return (
    <div className="song-list">
      {songs.map((song) => (        <div 
          key={song.id} 
          className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
          onClick={() => onPlaySong(song)}
        >          <div className="song-info">
            <div className="song-icon">
              {currentSong?.id === song.id ? (
                <i className="bi bi-play-circle-fill text-primary"></i>
              ) : (
                <i className="bi bi-music-note-beamed"></i>
              )}
            </div>            <div className="song-details">
              <h6 className="song-title mb-1 text-white">{song.title}</h6>              <p className="song-artist mb-0" style={{color: '#8e8e93'}}>{song.artist || 'Unknown Artist'}</p>              <small style={{color: '#8e8e93'}}>
                {song.duration && song.duration > 0 && `${formatDuration(song.duration)} • `}
                {formatFileSize(song.file_size)}
              </small>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .song-list {
          max-height: 60vh;
          overflow-y: auto;
        }        .song-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          transition: background-color 0.2s ease;
          background-color: transparent;
          cursor: pointer;
        }
        
        .song-item:hover {
          background-color: var(--background-tertiary);
        }
          .song-item.active {
          background-color: rgba(255, 146, 48, 0.1);
          border-color: var(--primary);
        }
          .song-info {
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .song-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          color: var(--text-muted);
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
        
        @media (max-width: 768px) {
          .song-item {
            padding: 0.75rem;
          }
          
          .song-icon {
            margin-right: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}
