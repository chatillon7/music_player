'use client'

import { useState, useRef } from 'react'
import { musicService, Song } from '@/lib/supabase'

interface SongUploadProps {
  onSongUploaded: (song: Song) => void
}

export default function SongUpload({ onSongUploaded }: SongUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('audio/')) {
      alert('Lütfen sadece ses dosyalarını yükleyin.')
      return
    }

    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Upload file to Supabase Storage
      const filePath = await musicService.uploadSong(file)
      
      // Extract metadata from file name (you can enhance this)
      const fileName = file.name.replace(/\.[^/.]+$/, '')
      const [artist, title] = fileName.includes(' - ') 
        ? fileName.split(' - ') 
        : ['Unknown Artist', fileName]

      // Save song metadata
      const songData = {
        title: title.trim(),
        artist: artist.trim(),
        file_path: filePath,
        file_size: file.size,
        duration: 0 // We'll calculate this later
      }

      const savedSong = await musicService.saveSongMetadata(songData)
      onSongUploaded(savedSong)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Yükleme başarısız oldu. Lütfen tekrar deneyin.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="upload-container">
      <div
        className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        
        {isUploading ? (
          <div className="text-center">
            <div className="spinner-border text-dark mb-3" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="mb-2">Dosya yükleniyor...</p>
            <div className="progress">
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <i className="bi bi-cloud-upload display-4 text-muted mb-3"></i>
            <h5>MP3 dosyasını buraya sürükleyin</h5>
            <p className="text-muted">veya tıklayarak dosya seçin</p>
            <button className="btn btn-dark">
              <i className="bi bi-folder-plus me-2"></i>
              Dosya Seç
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .upload-dropzone {
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 3rem 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color:rgb(250, 249, 248);
        }
        
        .upload-dropzone:hover {
          border-color:rgba(239, 255, 227, 0.64);
          background-color:rgb(239, 255, 227);
        }
        
        .upload-dropzone.dragging {
          border-color:rgba(239, 255, 227, 0.64);
          background-color:rgb(239, 255, 227);
          transform: scale(1.02);
        }
        
        .upload-dropzone.uploading {
          pointer-events: none;
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .upload-dropzone {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  )
}
