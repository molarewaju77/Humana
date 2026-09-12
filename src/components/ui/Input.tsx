import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, required, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="field-wrapper">
        {label && (
          <label htmlFor={inputId} className="field-label">
            {label}
            {required && <span className="text-brand-error ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          className={cn(
            'field-input',
            error && 'field-input-error',
            className,
          )}
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
