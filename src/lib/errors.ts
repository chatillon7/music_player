// Error handling utilities for the music player app

export interface AppError {
  code: string
  message: string
  details?: string
}

export class MusicPlayerError extends Error {
  code: string
  details?: string

  constructor(code: string, message: string, details?: string) {
    super(message)
    this.name = 'MusicPlayerError'
    this.code = code
    this.details = details
  }
}

// Error codes and messages
export const ERROR_CODES = {
  DATABASE_CONNECTION: 'DATABASE_CONNECTION',
  TABLE_NOT_FOUND: 'TABLE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  DELETE_FAILED: 'DELETE_FAILED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SUPABASE_CONFIG: 'SUPABASE_CONFIG'
}

export const ERROR_MESSAGES = {
  [ERROR_CODES.DATABASE_CONNECTION]: 'Veritabanı bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edin.',
  [ERROR_CODES.TABLE_NOT_FOUND]: 'Veritabanı tabloları bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.',
  [ERROR_CODES.UNAUTHORIZED]: 'Veritabanına erişim yetkisi yok. RLS politikaları kontrol edilmeli.',
  [ERROR_CODES.UPLOAD_FAILED]: 'Dosya yükleme başarısız oldu. Lütfen tekrar deneyin.',
  [ERROR_CODES.DELETE_FAILED]: 'Dosya silme işlemi başarısız oldu. Lütfen tekrar deneyin.',
  [ERROR_CODES.INVALID_FILE_TYPE]: 'Geçersiz dosya türü. Sadece MP3 dosyaları desteklenir.',
  [ERROR_CODES.FILE_TOO_LARGE]: 'Dosya boyutu çok büyük. Maksimum 50MB boyutunda dosya yükleyebilirsiniz.',
  [ERROR_CODES.NETWORK_ERROR]: 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.',
  [ERROR_CODES.SUPABASE_CONFIG]: 'Uygulama yapılandırması eksik. Lütfen sistem yöneticisi ile iletişime geçin.'
}

export function handleError(error: unknown): AppError {
  console.error('Application error:', error)

  // Convert error to a string message for inspection  
  const errorMessage = error instanceof Error ? error.message : String(error)

  // Check for specific error patterns
  if (errorMessage?.includes('relation "public.songs" does not exist')) {
    return {
      code: ERROR_CODES.TABLE_NOT_FOUND,
      message: ERROR_MESSAGES[ERROR_CODES.TABLE_NOT_FOUND],
      details: 'Veritabanı tabloları oluşturulması gerekiyor.'
    }
  }

  if (errorMessage?.includes('Failed to fetch')) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      details: errorMessage
    }
  }

  if (errorMessage?.includes('Invalid URL') || errorMessage?.includes('supabase')) {
    return {
      code: ERROR_CODES.SUPABASE_CONFIG,
      message: ERROR_MESSAGES[ERROR_CODES.SUPABASE_CONFIG],
      details: 'Supabase yapılandırması kontrol edilmeli.'
    }
  }

  // Check for 401 Unauthorized (RLS policy issue)
  if (errorMessage?.includes('401') || errorMessage?.includes('permission denied')) {
    return {
      code: ERROR_CODES.UNAUTHORIZED,
      message: ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      details: 'RLS politikaları veya API key kontrolü gerekli.'
    }
  }

  // Default error
  return {
    code: 'UNKNOWN_ERROR',
    message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    details: errorMessage || 'Bilinmeyen hata'
  }
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(
    url && 
    key && 
    url !== 'your_supabase_url_here' && 
    key !== 'your_supabase_anon_key_here' &&
    url.includes('supabase.co')
  )
}
