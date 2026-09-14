import { useForm, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { workPreferencesSchema, type WorkPreferencesData } from '../../lib/validators'
import FormSection from '../ui/FormSection'
import Textarea from '../ui/Textarea'
import Input from '../ui/Input'
import Button from '../ui/Button'

interface Props {
  defaultValues: Partial<WorkPreferencesData>
  onNext: (data: WorkPreferencesData) => void
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
              {...register(name as any)}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
            <span className="cursor-pointer">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="field-error text-xs text-brand-error">{error}</p>}
    </div>
  )
}

export default function Step4Preferences({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WorkPreferencesData>({
    resolver: zodResolver(workPreferencesSchema),
    defaultValues: defaultValues as WorkPreferencesData,
  })

  const roleType = watch('roleType') || ''
  const tenure = watch('tenureIntent') || ''

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-8">
      {/* ── Employment Preferences ── */}
      <FormSection
        title="Work Preferences"
        description="Help us understand the type of opportunity you are seeking."
      >
        <RadioGroup
          label="Are you seeking full-time or part-time employment?"
          name="employmentType"
          options={[
            { value: 'full-time', label: 'Full-time' },
            { value: 'part-time', label: 'Part-time' },
          ]}
          register={register}
          error={errors.employmentType?.message}
          required
        />

        <RadioGroup
          label="Are you willing to work flexible or extended hours?"
          name="flexibleHours"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          register={register}
          error={errors.flexibleHours?.message}
          required
        />

        <RadioGroup
          label="Preferred work arrangement"
          name="workArrangement"
          options={[
            { value: 'remote', label: 'Remote' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'on-site', label: 'On-site' },
          ]}
          register={register}
          error={errors.workArrangement?.message}
          required
        />

        <Textarea
          label="What type of role are you seeking?"
          required
          placeholder="Describe the type of role, function, or department you are looking to join…"
          value={roleType}
          showCount
          maxLength={400}
          error={errors.roleType?.message}
          {...register('roleType')}
        />

        <Textarea
          label="How long do you intend to work for this company?"
          required
          placeholder="e.g. I am looking for a long-term position and am committed to growing within the organisation…"
          value={tenure}
          showCount
          maxLength={400}
          error={errors.tenureIntent?.message}
          {...register('tenureIntent')}
        />

        <Input
          label="Are you seeking employment with a company of a particular size? (Optional)"
          placeholder="e.g. Small startup, mid-size company, large enterprise"
          error={errors.companySizePreference?.message}
          {...register('companySizePreference')}
        />
      </FormSection>

      {/* ── Payment & Mobile ── */}
      <FormSection
        title="Payment & Mobile"
        description="A few logistical details we need to set you up correctly."
      >
        <RadioGroup
          label="How would you prefer to be paid via direct deposit?"
          name="paymentPreference"
          options={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'biweekly', label: 'Bi-weekly' },
          ]}
          register={register}
          error={errors.paymentPreference?.message}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Which mobile phone carrier do you use?"
            required
            placeholder="e.g. Verizon, AT&T, T-Mobile"
            error={errors.mobileCarrier?.message}
            {...register('mobileCarrier')}
          />
        </div>

        <RadioGroup
          label="Is your mobile phone plan prepaid or postpaid?"
          name="mobilePlanType"
          options={[
            { value: 'prepaid', label: 'Prepaid' },
            { value: 'postpaid', label: 'Postpaid' },
          ]}
          register={register}
          error={errors.mobilePlanType?.message}
          required
        />
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
