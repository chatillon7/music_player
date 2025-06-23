import { createClient } from '@supabase/supabase-js'
import { ERROR_CODES, MusicPlayerError } from './errors'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Validate configuration
if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.warn('Supabase configuration is not properly set. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export interface Song {
  id: string
  title: string
  artist?: string
  duration?: number
  file_path: string
  file_size: number
  created_at: string
  updated_at: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  songs: Song[]
  created_at: string
  updated_at: string
}

// Database operations
export const musicService = {
  // Upload a song file to Supabase Storage
  async uploadSong(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `songs/${fileName}`

    const { error } = await supabase.storage
      .from('music-files')
      .upload(filePath, file)

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    return filePath
  },

  // Save song metadata to database
  async saveSongMetadata(songData: Omit<Song, 'id' | 'created_at' | 'updated_at'>): Promise<Song> {
    const { data, error } = await supabase
      .from('songs')
      .insert([songData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save song: ${error.message}`)
    }

    return data
  },
  // Get all songs
  async getAllSongs(): Promise<Song[]> {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // Enhanced error handling for specific cases
        if (error.message.includes('relation "public.songs" does not exist')) {
          throw new MusicPlayerError(
            ERROR_CODES.TABLE_NOT_FOUND,
            'Veritabanı tabloları bulunamadı',
            'Lütfen Supabase SQL Editor\'da init.sql dosyasını çalıştırın'
          )
        }
        throw new MusicPlayerError(
          ERROR_CODES.DATABASE_CONNECTION,
          'Şarkılar yüklenemedi',
          error.message
        )
      }

      return data || []
    } catch (error) {
      if (error instanceof MusicPlayerError) {
        throw error
      }
      throw new MusicPlayerError(
        ERROR_CODES.NETWORK_ERROR,
        'Ağ bağlantısı hatası',
        error instanceof Error ? error.message : 'Bilinmeyen hata'
      )
    }
  },

  // Delete a song
  async deleteSong(id: string): Promise<void> {
    // First get the song to get file path
    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch song: ${fetchError.message}`)
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('music-files')
      .remove([song.file_path])

    if (storageError) {
      console.error('Failed to delete file from storage:', storageError.message)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('songs')
      .delete()
      .eq('id', id)

    if (dbError) {
      throw new Error(`Failed to delete song: ${dbError.message}`)
    }
  },

  // Get public URL for a song file
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('music-files')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}
