import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle } from 'lucide-react'

export type InputFormatType = 'phone' | 'ssn' | 'zip' | 'credit-score' | 'number'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  formatType?: InputFormatType
  numericOnly?: boolean
  allowDecimals?: boolean
}

function formatPhoneNumber(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

function formatSSN(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 9)
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`
}

function formatZipCode(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 9)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      required,
      className,
      id,
      formatType,
      numericOnly,
      allowDecimals,
      onChange,
      onKeyDown,
      onPaste,
      inputMode,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const resolvedInputMode =
      inputMode ||
      (formatType === 'phone'
        ? 'tel'
        : formatType === 'ssn' || formatType === 'zip' || formatType === 'credit-score' || formatType === 'number' || numericOnly
        ? 'numeric'
        : undefined)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (formatType || numericOnly) {
        const isControlKey =
          [
            'Backspace',
            'Delete',
            'Tab',
            'Escape',
            'Enter',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Home',
            'End',
          ].includes(e.key) ||
          e.ctrlKey ||
          e.metaKey ||
          e.altKey

        if (isControlKey) {
          onKeyDown?.(e)
          return
        }

        if (allowDecimals && e.key === '.' && !e.currentTarget.value.includes('.')) {
          onKeyDown?.(e)
          return
        }

        // Only allow numbers 0-9; block all letters and symbols
        if (!/^\d$/.test(e.key)) {
          e.preventDefault()
          return
        }
      }

      onKeyDown?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value

      if (formatType === 'phone') {
        val = formatPhoneNumber(val)
      } else if (formatType === 'ssn') {
        val = formatSSN(val)
      } else if (formatType === 'zip') {
        val = formatZipCode(val)
      } else if (formatType === 'credit-score') {
        val = val.replace(/\D/g, '').slice(0, 3)
      } else if (formatType === 'number' || numericOnly) {
        if (allowDecimals) {
          val = val.replace(/[^\d.]/g, '').replace(/(\..*?)\..*/g, '$1')
        } else {
          val = val.replace(/\D/g, '')
        }
      }

      e.target.value = val
      onChange?.(e)
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (formatType || numericOnly) {
        const pasted = e.clipboardData.getData('text')
        if (formatType === 'credit-score' || formatType === 'zip' || (numericOnly && !allowDecimals)) {
          if (!/^\d+$/.test(pasted.replace(/[\s\(\)\-\.]/g, ''))) {
            e.preventDefault()
            return
          }
        }
      }
      onPaste?.(e)
    }

    return (
      <div className="field-wrapper w-full max-w-full min-w-0">
        {label && (
          <label htmlFor={inputId} className="field-label">
            {label}
            {required && <span className="text-brand-error ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          inputMode={resolvedInputMode}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          className={cn(
            'field-input w-full max-w-full min-w-0',
            error && 'field-input-error',
            className,
          )}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="field-error" role="alert">
            <AlertCircle size={12} className="shrink-0 mt-px" />
            {error}
          </p>
        )}
        {helper && !error && (
          <p id={`${inputId}-helper`} className="field-helper">
            {helper}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
export default Input
