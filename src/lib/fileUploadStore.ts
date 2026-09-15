import { uploadDocumentFile } from './supabase'

interface PendingItem {
  file: File
  previewUrl?: string
  uploadedUrl?: string
  uploadPromise?: Promise<string | null>
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

  const dataUrlPromise = readFileAsDataUrl(file)

  // Start background upload immediately so it's already finished by submit time
  const uploadPromise = uploadDocumentFile(file, 'candidate-uploads')
    .then((url) => {
      const item = pendingFiles.get(key)
      if (item) {
        item.uploadedUrl = url || undefined
      }
      return url
    })
    .catch(async (err) => {
      console.warn(`Supabase upload failed for ${key}, falling back to data URL:`, err)
      const dataUri = await dataUrlPromise
      const item = pendingFiles.get(key)
      if (item) {
        item.uploadedUrl = dataUri
      }
      return dataUri
    })

  pendingFiles.set(key, { file, previewUrl, uploadPromise })
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
 * Resolves all pending background uploads.
 * If already uploaded in the background, completes in 0ms!
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
    // If already uploaded in background, return immediately
    if (item.uploadedUrl) {
      results[key] = item.uploadedUrl
      return
    }

    try {
      const targetPromise = item.uploadPromise || uploadDocumentFile(item.file, folder)
      const url = await targetPromise
      if (url) {
        results[key] = url
      } else {
        results[key] = await readFileAsDataUrl(item.file)
      }
    } catch {
      results[key] = await readFileAsDataUrl(item.file)
    }
  })

  await Promise.all(uploadPromises)
  return results
}
