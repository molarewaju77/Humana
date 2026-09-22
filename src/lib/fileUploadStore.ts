import { uploadDocumentFile } from './supabase'

interface PendingItem {
  file: File
  previewUrl?: string
}

const pendingFiles = new Map<string, PendingItem>()

/**
 * Stores the selected file locally in memory with an instant preview URL.
 * Zero network requests are made until the candidate clicks "Submit Application".
 */
export function setPendingFile(key: string, file: File): { previewUrl?: string } {
  // Revoke old object URL if exists
  const existing = pendingFiles.get(key)
  if (existing?.previewUrl) {
    try {
      URL.revokeObjectURL(existing.previewUrl)
    } catch {
      // ignore
    }
  }

  let previewUrl: string | undefined
  if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)) {
    try {
      previewUrl = URL.createObjectURL(file)
    } catch {
      // ignore
    }
  }

  pendingFiles.set(key, { file, previewUrl })
  return { previewUrl }
}

export function getPendingFile(key: string): PendingItem | undefined {
  return pendingFiles.get(key)
}

export function removePendingFile(key: string) {
  const existing = pendingFiles.get(key)
  if (existing?.previewUrl) {
    try {
      URL.revokeObjectURL(existing.previewUrl)
    } catch {
      // ignore
    }
  }
  pendingFiles.delete(key)
}

export function clearAllPendingFiles() {
  for (const item of pendingFiles.values()) {
    if (item.previewUrl) {
      try {
        URL.revokeObjectURL(item.previewUrl)
      } catch {
        // ignore
      }
    }
  }
  pendingFiles.clear()
}

/**
 * Uploads all staged files to Supabase Storage in parallel only upon final application submission.
 * Returns a map of fieldName -> public Supabase storage URL.
 */
export async function uploadAllPendingFiles(
  folder: string = 'candidate-uploads'
): Promise<Record<string, string>> {
  const results: Record<string, string> = {}
  const entries = Array.from(pendingFiles.entries())

  if (entries.length === 0) {
    return results
  }

  const uploadPromises = entries.map(async ([key, item]) => {
    try {
      const publicUrl = await uploadDocumentFile(item.file, folder)
      if (publicUrl) {
        results[key] = publicUrl
      }
    } catch (err: any) {
      console.error(`Upload error for ${key} (${item.file.name}):`, err)
      throw new Error(`Failed to upload ${item.file.name}: ${err?.message || 'Upload error'}`)
    }
  })

  await Promise.all(uploadPromises)
  return results
}
