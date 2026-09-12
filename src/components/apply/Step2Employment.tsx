import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { employmentHistorySchema, type EmploymentHistoryData } from '../../lib/validators'
import FormSection from '../ui/FormSection'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Select from '../ui/Select'
import Button from '../ui/Button'

interface Props {
  defaultValues: Partial<EmploymentHistoryData>
  onNext: (data: EmploymentHistoryData) => void
  onBack: () => void
}

const experienceOptions = [
  { value: 'less-than-1', label: 'Less than 1 year' },
  { value: '1-2', label: '1–2 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '6-10', label: '6–10 years' },
  { value: '10+', label: '10+ years' },
]

export default function Step2Employment({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmploymentHistoryData>({
    resolver: zodResolver(employmentHistorySchema),
    defaultValues: defaultValues as EmploymentHistoryData,
  })

  const responsibilities = watch('responsibilities') || ''
  const whyRight = watch('whyRightCandidate') || ''

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-8">
      <FormSection
        title="Employment History"
        description="Tell us about your previous work experience and how you've developed professionally."
      >
        {/* Currently employed */}
        <div className="field-wrapper">
          <p className="field-label">
            Are you currently employed?{' '}
            <span className="text-brand-error" aria-hidden="true">*</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {(['yes', 'no'] as const).map((val) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={val}
                  {...register('currentlyEmployed')}
                  className="sr-only"
                  id={`employed-${val}`}
                />
                <label
                  htmlFor={`employed-${val}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm font-medium text-brand-secondarytext hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:text-primary has-[:checked]:bg-primary/10"
                >
                  <input
                    type="radio"
                    value={val}
                    {...register('currentlyEmployed')}
                    className="accent-primary w-3.5 h-3.5"
                    id={`employed-${val}-inner`}
                  />
                  {val === 'yes' ? 'Yes' : 'No'}
                </label>
              </label>
            ))}
          </div>
          {errors.currentlyEmployed && (
            <p className="field-error">{errors.currentlyEmployed.message}</p>
          )}
        </div>

        <Input
          label="How did you obtain your previous employment opportunities?"
          required
          placeholder="e.g. Job board, professional network, direct application, staffing agency"
          error={errors.howObtained?.message}
          {...register('howObtained')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Previous Job Title(s)"
            required
            placeholder="e.g. Senior Nurse, IT Manager"
            helper="List all relevant titles, separated by commas"
            error={errors.previousTitles?.message}
            {...register('previousTitles')}
          />
          <Input
            label="Previous Employer(s)"
            required
            placeholder="e.g. City General Hospital, ABC Corp"
            helper="List all relevant employers, separated by commas"
            error={errors.previousEmployers?.message}
            {...register('previousEmployers')}
          />
        </div>

        <Textarea
          label="Main Responsibilities and Achievements"
          required
          placeholder="Describe your key responsibilities, notable projects, and professional achievements in your previous roles…"
          showCount
          maxLength={600}
          value={responsibilities}
          error={errors.responsibilities?.message}
          {...register('responsibilities')}
        />

        <Select
          label="Years of Relevant Experience"
          required
          options={experienceOptions}
          placeholder="Select years of experience"
          error={errors.yearsExperience?.message}
          {...register('yearsExperience')}
        />
      </FormSection>

        <div className="mt-4 pt-4 border-t border-brand-border">
          <Textarea
            label="Why do you believe you are the right person for this position?"
            required
            placeholder="Describe what makes you uniquely qualified — your skills, experience, and values that align with this role…"
            showCount
            maxLength={600}
            value={whyRight}
            error={errors.whyRightCandidate?.message}
            {...register('whyRightCandidate')}
          />
        </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border">
        <Button type="button" variant="outline" size="lg" leftIcon={<ArrowLeft size={18} />} onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg" rightIcon={<ArrowRight size={18} />}>
          Continue
        </Button>
      </div>
    </form>
  )
}
