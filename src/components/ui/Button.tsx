import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'white' | 'subtle-green' | 'outline-white'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:bg-primary-700 shadow-card hover:-translate-y-px',
  secondary:
    'bg-brand-softbg text-brand-deeptext border border-brand-border hover:bg-muted active:bg-brand-border',
  ghost: 'bg-transparent text-brand-secondarytext hover:bg-muted hover:text-brand-deeptext',
  danger: 'bg-brand-error text-white hover:bg-red-700 active:bg-red-800',
  outline:
    'bg-white text-brand-deeptext border border-brand-border hover:bg-brand-softbg active:bg-muted',
  white:
    'bg-white text-brand-deeptext hover:bg-neutral-50 hover:text-primary active:bg-neutral-100 shadow-card-md hover:-translate-y-px',
  'subtle-green':
    'bg-[#2d5c14] text-white border border-white/30 hover:bg-[#234d0f] hover:border-white/50 active:bg-[#1a3a0b] shadow-card-md hover:-translate-y-px',
  'outline-white':
    'bg-white/5 hover:bg-white/15 active:bg-white/20 text-white border border-white hover:border-white shadow-sm hover:-translate-y-px backdrop-blur-xs',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-xs rounded-md gap-1.5',
  md: 'h-10 px-5 text-sm rounded-lg gap-2',
  lg: 'h-12 px-7 text-base rounded-lg gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none',
          !className?.includes('font-') && 'font-semibold',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'
export default Button
