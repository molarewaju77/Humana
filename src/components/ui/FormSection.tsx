import { cn } from '../../lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export default function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <fieldset className={cn('border-0 p-0 m-0', className)}>
      <legend className="w-full mb-6">
        <h2 className="text-xl font-semibold text-brand-deeptext">{title}</h2>
        {description && (
          <p className="text-sm text-brand-secondarytext mt-1.5 leading-relaxed">{description}</p>
        )}
      </legend>
      <div className="space-y-5">{children}</div>
    </fieldset>
  )
}
