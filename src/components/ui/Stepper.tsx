import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface Step {
  number: number
  title: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Application progress">
      {/* Desktop stepper */}
      <ol className="hidden md:flex items-center">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const isUpcoming = step.number > currentStep
          const isLast = idx === steps.length - 1

          return (
            <li key={step.number} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex flex-col items-center">
                <div
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'flex items-center justify-center size-9 rounded-full border-2 font-bold text-sm transition-all duration-300',
                    isCompleted && 'bg-primary border-primary text-white',
                    isCurrent && 'bg-white border-primary text-primary shadow-md',
                    isUpcoming && 'bg-white border-brand-border text-brand-secondarytext',
                  )}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <span className="tabular-nums">
                      {String(step.number).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-semibold whitespace-nowrap',
                    isCurrent ? 'text-brand-deeptext' : 'text-brand-secondarytext',
                  )}
                >
                  {step.title}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-3 mb-5 rounded-full transition-all duration-500',
                    isCompleted ? 'bg-primary' : 'bg-brand-border',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile stepper */}
      <div className="md:hidden flex items-center gap-3 py-2">
        <div className="flex gap-1.5">
          {steps.map((step) => (
            <div
              key={step.number}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                step.number < currentStep
                  ? 'bg-primary w-4'
                  : step.number === currentStep
                  ? 'bg-primary w-6'
                  : 'bg-brand-border w-4',
              )}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-brand-secondarytext ml-1">
          Step {currentStep} of {steps.length} — {steps[currentStep - 1]?.title}
        </span>
      </div>
    </nav>
  )
}
