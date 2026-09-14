import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CheckCircle2, Copy } from 'lucide-react'
import {
  personalInfoSchema,
  employmentHistorySchema,
  experienceSchema,
  workPreferencesSchema,
  additionalInfoSchema,
  type PersonalInfoData,
  type EmploymentHistoryData,
  type ExperienceData,
  type WorkPreferencesData,
  type AdditionalInfoData,
} from '../lib/validators'
import type { Application } from '../lib/types'
import { saveApplication } from '../lib/storage'
import { generateReferenceNumber, formatDateTime } from '../lib/utils'
import { useToast } from '../components/ui/Toast'
import Stepper from '../components/ui/Stepper'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'

// Step components (inline for clarity)
import Step1Personal from '../components/apply/Step1Personal'
import Step2Employment from '../components/apply/Step2Employment'
import Step3Experience from '../components/apply/Step3Experience'
import Step4Preferences from '../components/apply/Step4Preferences'
import Step5Additional from '../components/apply/Step5Additional'
import Step6Review from '../components/apply/Step6Review'

const STEPS = [
  { number: 1, title: 'Personal Info' },
  { number: 2, title: 'Employment' },
  { number: 3, title: 'Experience' },
  { number: 4, title: 'Preferences' },
  { number: 5, title: 'Additional' },
  { number: 6, title: 'Review' },
]

// Collect all form data across steps
export type FormStore = {
  personalInfo: Partial<PersonalInfoData>
  employmentHistory: Partial<EmploymentHistoryData>
  experience: Partial<ExperienceData>
  workPreferences: Partial<WorkPreferencesData>
  additionalInfo: Partial<AdditionalInfoData>
}

export default function ApplyPage() {
  const { addToast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [copied, setCopied] = useState(false)

  const [formStore, setFormStore] = useState<FormStore>({
    personalInfo: {},
    employmentHistory: {},
    experience: {},
    workPreferences: {},
    additionalInfo: {},
  })

  const progress = ((currentStep - 1) / STEPS.length) * 100

  function updateStore<K extends keyof FormStore>(key: K, data: FormStore[K]) {
    setFormStore((prev) => ({ ...prev, [key]: data }))
  }

  function goToStep(step: number) {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNext(key: keyof FormStore, data: FormStore[keyof FormStore]) {
    updateStore(key, data as FormStore[typeof key])
    goToStep(currentStep + 1)
  }

  function handleBack() {
    goToStep(currentStep - 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const refNum = generateReferenceNumber()
      const now = new Date().toISOString()

      const application: Application = {
        id: crypto.randomUUID(),
        referenceNumber: refNum,
        submittedAt: now,
        status: 'pending',
        personalInfo: formStore.personalInfo as Application['personalInfo'],
        employmentHistory: formStore.employmentHistory as Application['employmentHistory'],
        experience: formStore.experience as Application['experience'],
        workPreferences: formStore.workPreferences as Application['workPreferences'],
        additionalInfo: formStore.additionalInfo as Application['additionalInfo'],
        statusHistory: [{ status: 'pending', changedAt: now }],
        adminNotes: [],
      }

      saveApplication(application)
      setReferenceNumber(refNum)

      // Simulate brief processing delay for realism
      await new Promise((r) => setTimeout(r, 1200))

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      addToast('error', 'Submission failed', 'Please try again. If the problem persists, refresh the page.')
    } finally {
      setSubmitting(false)
    }
  }

  async function copyRef() {
    await navigator.clipboard.writeText(referenceNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // === SUCCESS SCREEN ===
  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-softbg flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-brand-border shadow-card-md p-8 sm:p-10 text-center animate-fade-in">
          <div className="mx-auto mb-6 flex items-center justify-center size-16 rounded-full bg-primary/10">
            <CheckCircle2 size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-brand-deeptext">Application Submitted</h1>
          <p className="mt-4 text-sm leading-relaxed text-brand-secondarytext">
            Thank you for applying. Your application has been successfully received and will be
            reviewed by the recruitment team. We appreciate your interest.
          </p>

          <div className="mt-8 rounded-xl bg-brand-softbg border border-brand-border p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-secondarytext mb-2">
              Your reference number
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-brand-deeptext tracking-wide tabular-nums">
                {referenceNumber}
              </span>
              <button
                type="button"
                onClick={copyRef}
                className="flex items-center justify-center size-8 rounded-lg border border-brand-border bg-white hover:bg-muted text-brand-secondarytext hover:text-brand-deeptext transition-colors"
                aria-label="Copy reference number"
              >
                <Copy size={14} />
              </button>
            </div>
            {copied && <p className="text-xs text-primary mt-2 font-medium">Copied to clipboard!</p>}
            <p className="text-xs text-brand-secondarytext mt-3 leading-relaxed">
              Please save your reference number for your records. You may be asked to provide it
              when following up on your application.
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-100 text-left">
            <p className="text-xs font-semibold text-amber-800">Important</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Submission of this application does not constitute an offer of employment, guarantee of
              an interview, or any other commitment from the organisation. Your application will be
              reviewed in line with our recruitment process.
            </p>
          </div>

          <a href="/" className="mt-8 block">
            <Button variant="outline" size="md" className="w-full">
              Return to Home
            </Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-softbg">
      {/* Page header */}
      <div className="bg-white border-b border-brand-border">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-brand-deeptext">Job Application</h1>
              <p className="text-sm text-brand-secondarytext mt-0.5">Hamana Careers Platform</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-brand-secondarytext">Application Progress</p>
              <p className="text-xs text-brand-secondarytext mt-0.5">
                Step {currentStep} of {STEPS.length}
              </p>
            </div>
          </div>
          <ProgressBar value={progress} />
          <div className="mt-6">
            <Stepper steps={STEPS} currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-8">
        <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6 sm:p-8 animate-fade-in" key={currentStep}>
          {currentStep === 1 && (
            <Step1Personal
              defaultValues={formStore.personalInfo}
              onNext={(data) => handleNext('personalInfo', data)}
            />
          )}
          {currentStep === 2 && (
            <Step2Employment
              defaultValues={formStore.employmentHistory}
              onNext={(data) => handleNext('employmentHistory', data)}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <Step3Experience
              defaultValues={formStore.experience}
              onNext={(data) => handleNext('experience', data)}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <Step4Preferences
              defaultValues={formStore.workPreferences}
              onNext={(data) => handleNext('workPreferences', data)}
              onBack={handleBack}
            />
          )}
          {currentStep === 5 && (
            <Step5Additional
              defaultValues={formStore.additionalInfo}
              onNext={(data) => handleNext('additionalInfo', data)}
              onBack={handleBack}
            />
          )}
          {currentStep === 6 && (
            <Step6Review
              formStore={formStore}
              onEdit={goToStep}
              onBack={handleBack}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  )
}
