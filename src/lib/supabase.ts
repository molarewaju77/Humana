import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clabdrxjocctpfbohad.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mvTcpUBigYx7x6VIzAgu6g_rVVxcwzl'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const BUCKET_NAME = 'applications-docs'

/**
 * Uploads a File object to the Supabase storage bucket and returns its public URL or file path.
 */
export async function uploadDocumentFile(file: File, folder: string = 'candidate-uploads'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
    const fileName = `${folder}/${Date.now()}_${cleanBaseName}.${fileExt}`

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.warn('Supabase storage upload error:', error.message)
      return file.name
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return urlData?.publicUrl || data.path
  } catch (err) {
    console.error('File upload exception:', err)
    return file.name
  }
}
