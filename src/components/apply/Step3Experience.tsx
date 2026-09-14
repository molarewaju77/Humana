import { useForm, Controller, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { experienceSchema, type ExperienceData } from '../../lib/validators'
import FormSection from '../ui/FormSection'
import Textarea from '../ui/Textarea'
import FileUpload from '../ui/FileUpload'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface Props {
  defaultValues: Partial<ExperienceData>
  onNext: (data: ExperienceData) => void
  onBack: () => void
}

function RadioGroup({
  label,
  name,
  options,
  register,
  error,
  required,
  helper,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
  register: UseFormRegister<any>
  error?: string
  required?: boolean
  helper?: string
}) {
  return (
    <div className="field-wrapper">
      <p className="field-label">
        {label}
        {required && <span className="text-brand-error ml-0.5">*</span>}
      </p>
      {helper && <p className="text-xs text-brand-secondarytext mb-2">{helper}</p>}
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm font-medium text-brand-secondarytext hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:text-primary has-[:checked]:bg-primary/10 select-none"
          >
            <input
              type="radio"
              value={opt.value}
              {...(register as any)(name)}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
            <span className="cursor-pointer">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="field-error text-xs text-brand-error mt-1">{error}</p>}
    </div>
  )
}

export default function Step3Experience({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ExperienceData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues as ExperienceData,
  })

  const relevantExp = watch('relevantExperience') || ''
  const proudAch = watch('proudAchievement') || ''

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-8">
      {/* ── Professional Background ── */}
      <FormSection
        title="Experience & Skills"
        description="Tell us about your professional background, skills, and what you have accomplished."
      >
        <Input
          label="What types of positions have you previously held?"
          required
          placeholder="e.g. Clinical, supervisory, technical, administrative roles"
          error={errors.positionTypes?.message}
          {...register('positionTypes')}
        />

        <Textarea
          label="Describe your relevant experience"
          required
          placeholder="Describe your relevant professional experience, the industries you've worked in, and the types of challenges you've tackled…"
          showCount
          maxLength={800}
          value={relevantExp}
          error={errors.relevantExperience?.message}
          {...register('relevantExperience')}
        />

        <Input
          label="What are your key professional skills?"
          required
          placeholder="e.g. Patient care, project management, data analysis, leadership"
          helper="Separate skills with commas"
          error={errors.keySkills?.message}
          {...register('keySkills')}
        />

        <Textarea
          label="What achievement are you most proud of?"
          required
          placeholder="Describe a professional achievement that you are particularly proud of and the impact it had…"
          showCount
          maxLength={500}
          value={proudAch}
          error={errors.proudAchievement?.message}
          {...register('proudAchievement')}
        />
      </FormSection>

      {/* ── Regular Technical Requirements ── */}
      <FormSection
        title="Regular Technical Requirements"
        description="Please answer if you have regular technical experience."
      >
        <RadioGroup
          label="Do you have an HP LaserJet printer, copier, and scanner?"
          name="hasHPPrinter"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          register={register}
          error={errors.hasHPPrinter?.message}
          required
          helper="This helps us understand your current workspace setup."
        />

        <RadioGroup
          label="Do you have experience with check printing?"
          name="checkPrintingExp"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          register={register}
          error={errors.checkPrintingExp?.message}
          required
        />
      </FormSection>

      {/* ── Documents ── */}
      <FormSection
        title="Documents"
        description="Upload your resume and any supporting portfolio documents."
      >
        <Controller
          name="resumeFileName"
          control={control}
          render={({ field }) => (
            <FileUpload
              label="Upload Resume"
              helper="PDF, DOC, or DOCX · Maximum 5MB"
              value={field.value}
              onChange={field.onChange}
              error={errors.resumeFileName?.message}
            />
          )}
        />

        <div className="mt-4">
          <Controller
            name="portfolioFileName"
            control={control}
            render={({ field }) => (
              <FileUpload
                label="Upload Portfolio (Optional)"
                helper="Supporting work samples · PDF, DOC, or DOCX · Maximum 5MB"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </FormSection>

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
