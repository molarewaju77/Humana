import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle } from 'lucide-react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  showCount?: boolean
  maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, required, showCount, maxLength, className, id, value, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="field-wrapper">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={textareaId} className="field-label">
              {label}
              {required && <span className="text-brand-error ml-0.5" aria-hidden="true">*</span>}
            </label>
            {showCount && maxLength && (
              <span className={cn('text-xs tabular-nums', currentLength > maxLength * 0.9 ? 'text-brand-warning' : 'text-brand-secondarytext')}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          aria-invalid={!!error}
          className={cn(
            'field-input resize-none min-h-[120px] leading-relaxed',
            error && 'field-input-error',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="field-error" role="alert">
            <AlertCircle size={12} className="shrink-0 mt-px" />
            {error}
          </p>
        )}
        {helper && !error && <p className="field-helper">{helper}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
export default Textarea
