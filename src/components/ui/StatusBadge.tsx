import type { ApplicationStatus } from '../../lib/types'
import { getStatusLabel, getStatusColor } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface StatusBadgeProps {
  status: ApplicationStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold',
        getStatusColor(status),
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
      )}
    >
      <span
        className="mr-1.5 size-1.5 rounded-full bg-current opacity-70"
        aria-hidden="true"
      />
      {getStatusLabel(status)}
    </span>
  )
}
