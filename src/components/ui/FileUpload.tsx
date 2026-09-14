import { useRef, useState } from 'react'
import { UploadCloud, X, FileText, AlertCircle } from 'lucide-react'
import { cn, validateFile } from '../../lib/utils'

interface FileUploadProps {
  label?: string
  required?: boolean
  error?: string
  helper?: string
  value?: string // stored file name
  onChange?: (fileName: string | undefined) => void
  accept?: string
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

  function handleFile(file: File) {
    const validationError = validateFile(file)
    if (validationError) {
      setLocalError(validationError)
      return
    }
    setLocalError('')
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
    onChange?.(undefined)
    setLocalError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const displayError = localError || error

  return (
    <div className="field-wrapper">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="text-brand-error ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}

      {value ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-brand-border bg-brand-softbg">
          <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brand-deeptext truncate">{value}</p>
            <p className="text-xs text-brand-secondarytext">File ready for submission</p>
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
