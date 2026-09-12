import { cn } from '../../lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export default function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('pt-8 first:pt-0 border-t border-brand-border/70 first:border-0', className)}>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-brand-deeptext tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs text-brand-secondarytext mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}
