import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  label?: string
  showLabel?: boolean
}

export default function ProgressBar({ value, label, showLabel = true }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-brand-secondarytext">{label || 'Progress'}</span>
          <span className="text-xs font-bold text-primary tabular-nums">{Math.round(clamped)}% complete</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-brand-border rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
