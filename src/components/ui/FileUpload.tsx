import { useRef, useState } from 'react'
import { UploadCloud, X, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { cn, validateFile } from '../../lib/utils'
import { uploadDocumentFile } from '../../lib/supabase'

interface FileUploadProps {
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

export default function FileUpload({
  label,
  required,
  error,
  helper,
  value,
  onChange,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [localError, setLocalError] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    const validationError = validateFile(file)
    if (validationError) {
      setLocalError(validationError)
      return
    }
    setLocalError('')
    setUploading(true)

    try {
      const uploadedUrl = await uploadDocumentFile(file)
      if (uploadedUrl) {
        onChange?.(uploadedUrl)
      }
    } catch (err: any) {
      setLocalError(err.message || 'Failed to upload file to storage. Check bucket configuration.')
    } finally {
      setUploading(false)
    }
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
    onChange?.(undefined)
    setLocalError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const displayError = localError || error
  const displayFileName = getDisplayFileName(value)

  return (
    <div className="field-wrapper">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="text-brand-error ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}

      {value ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-primary/30 bg-primary/5">
          <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-brand-deeptext truncate">{displayFileName}</p>
              <CheckCircle2 size={14} className="text-primary shrink-0" />
            </div>
            <p className="text-xs text-brand-secondarytext">Uploaded & ready for submission</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 size-7 flex items-center justify-center rounded-md text-brand-secondarytext hover:text-brand-error hover:bg-red-50 transition-colors"
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      ) : uploading ? (
        <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 size={26} className="text-primary animate-spin" />
          <div>
            <p className="text-sm font-semibold text-brand-deeptext">Uploading file to storage…</p>
            <p className="text-xs text-brand-secondarytext mt-0.5">Please wait a moment</p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 text-center',
            dragActive
              ? 'border-primary bg-primary/5'
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
            'size-12 flex items-center justify-center rounded-xl transition-colors',
            dragActive ? 'bg-primary/20 text-primary' : 'bg-white text-brand-secondarytext border border-brand-border',
          )}>
            <UploadCloud size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-deeptext">
              {dragActive ? 'Drop to upload' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-brand-secondarytext mt-1">PDF, DOC, DOCX, JPG, PNG · Max 5MB</p>
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
        disabled={uploading}
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
