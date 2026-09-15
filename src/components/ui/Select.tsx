import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle, ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, required, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="field-wrapper w-full max-w-full min-w-0">
        {label && (
          <label htmlFor={selectId} className="field-label">
            {label}
            {required && <span className="text-brand-error ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative w-full max-w-full min-w-0">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={cn(
              'field-input appearance-none pr-9 w-full max-w-full min-w-0',
              error && 'field-input-error',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondarytext pointer-events-none"
          />
        </div>
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

Select.displayName = 'Select'
export default Select
