import { useRef, useState, useEffect } from 'react'
import { UploadCloud, X, FileText, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react'
import { cn, validateFile } from '../../lib/utils'
import { setPendingFile, removePendingFile, getPendingFile } from '../../lib/fileUploadStore'

interface FileUploadProps {
  name?: string
  label?: string
  required?: boolean
  error?: string
  helper?: string
  value?: string // stored file name or public URL
  onChange?: (fileName: string | undefined) => void
  accept?: string
}

function getDisplayFileName(val?: string) {
  if (!val) return ''
  try {
    if (val.startsWith('http://') || val.startsWith('https://')) {
      const url = new URL(val)
      const pathname = url.pathname
      const lastPart = pathname.split('/').pop() || val
      const cleanName = lastPart.replace(/^\d+_/, '')
      return decodeURIComponent(cleanName)
    }
  } catch {
    // fallback
  }
  return val
}

function formatFileSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUpload({
  name,
  label,
  required,
  error,
  helper,
  value,
  onChange,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp',
}: FileUploadProps) {
  const storeKey = name || label || 'document_file'
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [localError, setLocalError] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(() => getPendingFile(storeKey)?.previewUrl)
  const [fileSize, setFileSize] = useState<number | undefined>(() => getPendingFile(storeKey)?.file.size)

  // Sync preview if store changes
  useEffect(() => {
    const item = getPendingFile(storeKey)
    if (item) {
      setPreviewUrl(item.previewUrl)
      setFileSize(item.file.size)
    } else if (!value) {
      setPreviewUrl(undefined)
      setFileSize(undefined)
    }
  }, [storeKey, value])

  function handleFile(file: File) {
    const validationError = validateFile(file)
    if (validationError) {
      setLocalError(validationError)
      return
    }
    setLocalError('')

    // Instantly register file into upload store
    const { previewUrl: pUrl } = setPendingFile(storeKey, file)
    setPreviewUrl(pUrl)
    setFileSize(file.size)

    // Notify form controller with file name immediately
    onChange?.(file.name)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    removePendingFile(storeKey)
    setPreviewUrl(undefined)
    setFileSize(undefined)
    setLocalError('')
    onChange?.(undefined)
    if (inputRef.current) inputRef.current.value = ''
  }

  const displayError = localError || error
  const displayFileName = getDisplayFileName(value)
  const isImage = previewUrl || /\.(jpg|jpeg|png|webp|gif)$/i.test(displayFileName)
  const imageSource = previewUrl || (value?.startsWith('http') ? value : undefined)

  return (
    <div className="field-wrapper">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="text-brand-error ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}

      {value ? (
        <div className="flex items-center gap-3.5 p-3 rounded-xl border border-primary/40 bg-primary/5 shadow-2xs transition-all">
          {/* Thumbnail preview if image, or Document icon */}
          {isImage && imageSource ? (
            <div className="size-12 rounded-lg overflow-hidden border border-primary/20 bg-white shrink-0 flex items-center justify-center">
              <img
                src={imageSource}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {isImage ? <ImageIcon size={22} /> : <FileText size={22} />}
            </div>
          )}

          {/* File details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-brand-deeptext truncate">{displayFileName}</p>
              <CheckCircle2 size={14} className="text-primary shrink-0" />
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-brand-secondarytext">
              {fileSize && <span>{formatFileSize(fileSize)}</span>}
              {fileSize && <span>•</span>}
              <span className="text-primary font-medium">Ready to submit</span>
            </div>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 size-8 flex items-center justify-center rounded-lg text-brand-secondarytext hover:text-brand-error hover:bg-red-50 transition-colors"
            title="Remove file"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-7 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 text-center',
            dragActive
              ? 'border-primary bg-primary/5 scale-[0.99]'
              : displayError
              ? 'border-brand-error/40 bg-red-50/30'
              : 'border-brand-border bg-brand-softbg hover:border-primary/50 hover:bg-primary/5',
          )}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          aria-label={`Upload ${label || 'file'}`}
        >
          <div className={cn(
            'size-11 flex items-center justify-center rounded-xl transition-colors',
            dragActive ? 'bg-primary/20 text-primary' : 'bg-white text-brand-secondarytext border border-brand-border',
          )}>
            <UploadCloud size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-deeptext">
              {dragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-brand-secondarytext mt-0.5">
              {accept.includes('jpg') ? 'Images (JPG, PNG, WebP) or PDF, DOC · Max 5MB' : 'PDF, DOC, DOCX, JPG, PNG · Max 5MB'}
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
        aria-hidden="true"
      />

      {displayError && (
        <p className="field-error" role="alert">
          <AlertCircle size={12} className="shrink-0 mt-px" />
          {displayError}
        </p>
      )}
      {helper && !displayError && <p className="field-helper">{helper}</p>}
    </div>
  )
}
