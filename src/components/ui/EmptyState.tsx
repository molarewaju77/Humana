import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && (
        <div className="mb-5 flex items-center justify-center size-16 rounded-2xl bg-brand-softbg border border-brand-border text-brand-secondarytext">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-brand-deeptext">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-brand-secondarytext max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
