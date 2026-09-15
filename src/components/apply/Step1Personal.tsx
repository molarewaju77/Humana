import { useForm, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { personalInfoSchema, type PersonalInfoData } from '../../lib/validators'
import FormSection from '../ui/FormSection'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

interface Props {
  defaultValues: Partial<PersonalInfoData>
  onNext: (data: PersonalInfoData) => void
}

const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

function RadioGroup({
  label,
  name,
  options,
  register,
  error,
  required,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
  register: UseFormRegister<any>
  error?: string
  required?: boolean
}) {
  return (
    <div className="field-wrapper">
      <p className="field-label">
        {label}
        {required && <span className="text-brand-error ml-0.5">*</span>}
      </p>
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

export default function Step1Personal({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: defaultValues as PersonalInfoData,
  })

  const selfIntro = watch('selfIntroduction') || ''

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-8">
      {/* ── Identity ── */}
      <FormSection
        title="Personal Information"
        description="Please provide your personal details. All information is handled with strict confidentiality."
      >
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="First Name"
            required
            placeholder="Jane"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            required
            placeholder="Smith"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Date of Birth"
            required
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
          <Select
            label="Gender (optional)"
            options={genderOptions}
            placeholder="Prefer not to say"
            error={errors.gender?.message}
            {...register('gender')}
          />
        </div>

        {/* Marital Status */}
        <Select
          label="Marital Status"
          required
          options={maritalStatusOptions}
          placeholder="Select your marital status"
          error={errors.maritalStatus?.message}
          {...register('maritalStatus')}
        />

        {/* Self-introduction */}
        <div className="field-wrapper">
          <label className="field-label" htmlFor="selfIntroduction">
            Please introduce yourself, include your current location, gender, and age
            <span className="text-brand-error ml-0.5">*</span>
          </label>
          {/* <p className="text-xs text-brand-secondarytext mb-2">
            Hi! I'm Carmen, Hiring Manager at Humana. Please take a moment to introduce yourself before we proceed.
          </p> */}
          <textarea
            id="selfIntroduction"
            rows={4}
            placeholder="e.g. My name is Jane Smith. I am 32 years old, female, and currently located in Austin, Texas…"
            className="field-input w-full resize-none min-h-[110px] leading-relaxed"
            {...register('selfIntroduction')}
          />
          <div className="flex justify-between mt-1">
            {errors.selfIntroduction ? (
              <p className="field-error text-xs text-brand-error">{errors.selfIntroduction.message}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-brand-secondarytext tabular-nums">{selfIntro.length} / 800</span>
          </div>
        </div>
      </FormSection>

      {/* ── Contact ── */}
      <FormSection
        title="Contact Details"
        description="We'll use this information to follow up on your application."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Email Address"
            required
            type="email"
            placeholder="jane.smith@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone Number"
            required
            type="tel"
            formatType="phone"
            placeholder="(555) 000-0000"
            helper="10-digit standard phone number"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <Input
          label="Street Address"
          required
          placeholder="123 Main Street, Apt 4B"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="col-span-2">
            <Input
              label="City"
              required
              placeholder="New York"
              error={errors.city?.message}
              {...register('city')}
            />
          </div>
          <Input
            label="State / Region"
            required
            placeholder="NY"
            error={errors.state?.message}
            {...register('state')}
          />
          <Input
            label="Zip / Postal Code"
            required
            formatType="zip"
            maxLength={10}
            placeholder="10001"
            error={errors.zipCode?.message}
            {...register('zipCode')}
          />
        </div>

        <Input
          label="Country"
          required
          placeholder="United States"
          error={errors.country?.message}
          {...register('country')}
        />

        <RadioGroup
          label="Do you have a social handle we can reach you on (WhatsApp or iMessage)?"
          name="socialHandle"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          register={register}
          error={errors.socialHandle?.message}
          required
        />
      </FormSection>

      {/* ── Professional Profiles (optional) ── */}
      <FormSection
        title="Professional Profiles"
        description="Optional — share your online presence to strengthen your application."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="LinkedIn Profile"
            type="url"
            placeholder="https://linkedin.com/in/your-profile"
            helper="Your full LinkedIn profile URL"
            error={errors.linkedin?.message}
            {...register('linkedin')}
          />
          <Input
            label="Portfolio / Website"
            type="url"
            placeholder="https://yourportfolio.com"
            helper="Personal website, GitHub, or portfolio link"
            error={errors.portfolio?.message}
            {...register('portfolio')}
          />
        </div>
      </FormSection>

      <div className="flex justify-end mt-8 pt-6 border-t border-brand-border">
        <Button type="submit" size="lg" rightIcon={<ArrowRight size={18} />}>
          Continue
        </Button>
      </div>
    </form>
  )
}
