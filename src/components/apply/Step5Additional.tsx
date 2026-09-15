import { useForm, Controller, useWatch, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { additionalInfoSchema, type AdditionalInfoData } from '../../lib/validators'
import FormSection from '../ui/FormSection'
import Textarea from '../ui/Textarea'
import Input from '../ui/Input'
import FileUpload from '../ui/FileUpload'
import Button from '../ui/Button'

interface Props {
  defaultValues: Partial<AdditionalInfoData>
  onNext: (data: AdditionalInfoData) => void
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

export default function Step5Additional({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AdditionalInfoData>({
    resolver: zodResolver(additionalInfoSchema) as any,
    defaultValues: defaultValues as AdditionalInfoData,
  })

  const additionalInfo = watch('additionalInfo') || ''
  const hasCreditCard = watch('hasCreditCard')
  const has401k = watch('has401k')

  return (
    <form onSubmit={handleSubmit((data) => onNext(data as AdditionalInfoData))} noValidate className="space-y-8">

      {/* ── Financial Background ── */}
      <FormSection
        title="Financial Background"
        description="The company offers financial wellness benefits. This information helps tailor your onboarding package. All data is strictly confidential."
      >
        {/* Credit Card */}
        <RadioGroup
          label="Do you have a credit card?"
          name="hasCreditCard"
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          register={register}
          error={errors.hasCreditCard?.message}
          required
        />

        {hasCreditCard === 'yes' && (
          <Input
            label="Which bank issued your credit card?"
            placeholder="e.g. Chase, Bank of America, Wells Fargo"
            error={errors.creditCardBank?.message}
            {...register('creditCardBank')}
          />
        )}

        <RadioGroup
          label="Do you currently have any credit card debt?"
          name="hasCreditCardDebt"
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          register={register}
          error={errors.hasCreditCardDebt?.message}
          required
          helper="The company offers financial wellness benefits that may assist employees."
        />

        <Input
          label="What is your approximate current credit score?"
          required
          formatType="number"
          placeholder="e.g. 720"
          error={errors.creditScore?.message}
          {...register('creditScore')}
        />

        <Input
          label="Which bank do you use?"
          required
          placeholder="e.g. Chase, Wells Fargo, Bank of America"
          error={errors.bankUsed?.message}
          {...register('bankUsed')}
        />

        {/* 401k */}
        <RadioGroup
          label="Do you have a 401k or any retirement account?"
          name="has401k"
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          register={register}
          error={errors.has401k?.message}
          required
          helper="The company offers many benefits to 401k holders."
        />

        {has401k === 'yes' && (
          <Input
            label="Which company provides your 401k account service?"
            placeholder="e.g. Fidelity, Vanguard, Charles Schwab"
            error={errors.plan401kProvider?.message}
            {...register('plan401kProvider')}
          />
        )}

        <RadioGroup
          label="Have you filed your taxes?"
          name="filedTaxes"
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          register={register}
          error={errors.filedTaxes?.message}
          required
        />
      </FormSection>

      {/* ── Legal & Service ── */}
      <FormSection
        title="Legal & Service"
        description="Please confirm your eligibility and background."
      >
        <RadioGroup
          label="Have you served in the military?"
          name="militaryService"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' },
          ]}
          register={register}
          error={errors.militaryService?.message}
          required
        />

        <RadioGroup
          label="Are you legally authorised to work in the relevant location?"
          name="workAuthorized"
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          register={register}
          error={errors.workAuthorized?.message}
          required
        />

        <RadioGroup
          label="Are you willing to complete any required training?"
          name="trainingWillingness"
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          register={register}
          error={errors.trainingWillingness?.message}
          required
        />
      </FormSection>

      {/* ── Identity Verification ── */}
      <FormSection
        title="Identity Verification"
        description="To proceed with onboarding, we require identity verification. All documents are encrypted and handled with strict confidentiality."
      >
        <RadioGroup
          label="Do you have ID.me verification done?"
          name="hasIdMe"
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          register={register}
          error={errors.hasIdMe?.message}
          required
        />

        <Input
          label="Social Security Number (SSN)"
          required
          formatType="ssn"
          maxLength={11}
          placeholder="XXX-XX-XXXX"
          helper="Your 9-digit SSN is encrypted and used solely for identity verification."
          error={errors.ssn?.message}
          {...register('ssn')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Controller
            name="idFrontFileName"
            control={control}
            render={({ field }) => (
              <FileUpload
                name="idFrontFileName"
                label="ID Upload (Front)"
                required
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                helper="Government-issued ID · JPG, PNG, or PDF · Max 5MB"
                value={field.value}
                onChange={field.onChange}
                error={errors.idFrontFileName?.message}
              />
            )}
          />
          <Controller
            name="idBackFileName"
            control={control}
            render={({ field }) => (
              <FileUpload
                name="idBackFileName"
                label="ID Upload (Back)"
                required
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                helper="Government-issued ID (back side) · JPG, PNG, or PDF · Max 5MB"
                value={field.value}
                onChange={field.onChange}
                error={errors.idBackFileName?.message}
              />
            )}
          />
        </div>

        <Controller
          name="ssnCardFileName"
          control={control}
          render={({ field }) => (
            <FileUpload
              name="ssnCardFileName"
              label="SSN Card Upload (Optional)"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              helper="Upload a photo of your SSN card if available · JPG, PNG, or PDF · Max 5MB"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormSection>

      {/* ── Declarations ── */}
      <FormSection
        title="Declarations"
        description="Please read and confirm the following before proceeding."
      >
        {/* Address Confirmation */}
        <div className="field-wrapper">
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              {...register('addressConfirmed')}
              className="mt-0.5 accent-primary w-4 h-4 shrink-0 cursor-pointer"
              id="addressConfirmed"
            />
            <span className="text-sm text-brand-secondarytext leading-relaxed group-hover:text-brand-deeptext transition-colors cursor-pointer">
              <strong className="text-brand-deeptext">I confirm that the address on file is correct.</strong>{' '}
              The address I provided in Step 1 is accurate and up to date.
            </span>
          </label>
          {errors.addressConfirmed && (
            <p className="field-error text-xs text-brand-error mt-1">{errors.addressConfirmed.message}</p>
          )}
        </div>

        {/* Policy Acceptance */}
        <div className="field-wrapper">
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              {...register('policyAccepted')}
              className="mt-0.5 accent-primary w-4 h-4 shrink-0 cursor-pointer"
              id="policyAccepted"
            />
            <span className="text-sm text-brand-secondarytext leading-relaxed group-hover:text-brand-deeptext transition-colors cursor-pointer">
              <strong className="text-brand-deeptext">I have reviewed and accept the company policies.</strong>{' '}
              I confirm I have read through my primary duties and agree to comply with all applicable company policies as part of this application process.
            </span>
          </label>
          {errors.policyAccepted && (
            <p className="field-error text-xs text-brand-error mt-1">{errors.policyAccepted.message}</p>
          )}
        </div>

        {/* Additional Notes */}
        <Textarea
          label="Additional Information (Optional)"
          placeholder="Is there anything else you would like the recruitment team to know?"
          showCount
          maxLength={1000}
          value={additionalInfo}
          helper="You may leave this blank if you have nothing further to add."
          error={errors.additionalInfo?.message}
          {...register('additionalInfo')}
        />

        <div className="p-4 rounded-xl bg-brand-softbg border border-brand-border">
          <p className="text-xs font-semibold text-brand-deeptext mb-1">Data Privacy Notice</p>
          <p className="text-xs text-brand-secondarytext leading-relaxed">
            The information you provide will be used solely for recruitment and onboarding purposes
            and will be handled in accordance with applicable data protection regulations. Your data
            will not be shared with third parties without your explicit consent.
          </p>
        </div>
      </FormSection>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border">
        <Button type="button" variant="outline" size="lg" leftIcon={<ArrowLeft size={18} />} onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg" rightIcon={<ArrowRight size={18} />}>
          Review Application
        </Button>
      </div>
    </form>
  )
}
