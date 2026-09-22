import { uploadDocumentFile } from './supabase'

interface PendingItem {
  file: File
  previewUrl?: string
}

const pendingFiles = new Map<string, PendingItem>()

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => resolve(file.name)
    reader.readAsDataURL(file)
  })
}

/**
 * Stores the selected file locally in memory with an instant preview.
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
 * Uploads all staged files to Supabase Storage only upon final application submission.
 * Parallel uploads for speed, with resilient fallback.
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
      const url = await uploadDocumentFile(item.file, folder)
      if (url) {
        results[key] = url
      } else {
        results[key] = await readFileAsDataUrl(item.file)
      }
    } catch (err) {
      console.warn(`Upload fallback for ${key}:`, err)
      results[key] = await readFileAsDataUrl(item.file)
    }
  })

  await Promise.all(uploadPromises)
  return results
}
