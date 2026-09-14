import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clabdrxjocctpfbohad.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mvTcpUBigYx7x6VIzAgu6g_rVVxcwzl'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const BUCKET_NAME = 'application-files'

/**
 * Uploads a File object to the Supabase storage bucket and returns its public URL or file path.
 */
export async function uploadDocumentFile(file: File, folder: string = 'documents'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`

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
