import { ArrowLeft, Edit2, FileText, Send } from 'lucide-react'
import type { FormStore } from '../../pages/ApplyPage'
import Button from '../ui/Button'

interface Props {
  formStore: FormStore
  onEdit: (step: number) => void
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
}

function ReviewCard({
  title,
  step,
  onEdit,
  children,
}: {
  title: string
  step: number
  onEdit: (step: number) => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border bg-brand-softbg">
        <h3 className="text-sm font-semibold text-brand-deeptext">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          <Edit2 size={12} />
          Edit
        </button>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-xs font-semibold text-brand-secondarytext sm:w-44 shrink-0">{label}</span>
      <span className="text-sm text-brand-deeptext leading-relaxed flex-1">{value}</span>
    </div>
  )
}

function YesNo(val: string | undefined): string | undefined {
  if (!val) return undefined
  return val === 'yes' ? 'Yes' : val === 'no' ? 'No' : val
}

export default function Step6Review({ formStore, onEdit, onBack, onSubmit, submitting }: Props) {
  const {
    personalInfo: pi,
    employmentHistory: eh,
    experience: ex,
    workPreferences: wp,
    additionalInfo: ai,
  } = formStore

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brand-deeptext">Review Your Application</h2>
        <p className="text-sm text-brand-secondarytext mt-1.5 leading-relaxed">
          Please review all information carefully before submitting. Use the Edit buttons to make any
          corrections.
        </p>
      </div>

      <div className="space-y-4">

        {/* ── Step 1: Personal Information ── */}
        <ReviewCard title="Personal Information" step={1} onEdit={onEdit}>
          <Field label="Full Name" value={`${pi.firstName ?? ''} ${pi.lastName ?? ''}`.trim()} />
          <Field label="Date of Birth" value={pi.dateOfBirth} />
          <Field label="Gender" value={pi.gender} />
          <Field label="Marital Status" value={pi.maritalStatus} />
          <Field label="Self Introduction" value={pi.selfIntroduction} />
          <Field label="Email" value={pi.email} />
          <Field label="Phone" value={pi.phone} />
          <Field
            label="Address"
            value={[pi.address, pi.city, pi.state, pi.zipCode, pi.country]
              .filter(Boolean)
              .join(', ')}
          />
          <Field
            label="Social Handle"
            value={pi.socialHandle === 'yes' ? 'Yes — has WhatsApp/iMessage' : pi.socialHandle === 'no' ? 'No' : undefined}
          />
          {pi.linkedin && <Field label="LinkedIn" value={pi.linkedin} />}
          {pi.portfolio && <Field label="Portfolio" value={pi.portfolio} />}
        </ReviewCard>

        {/* ── Step 2: Employment History ── */}
        <ReviewCard title="Employment History" step={2} onEdit={onEdit}>
          <Field label="Currently Employed" value={YesNo(eh.currentlyEmployed)} />
          <Field label="How Obtained" value={eh.howObtained} />
          <Field label="Previous Titles" value={eh.previousTitles} />
          <Field label="Previous Employers" value={eh.previousEmployers} />
          <Field label="Years of Experience" value={eh.yearsExperience} />
          <Field label="Responsibilities" value={eh.responsibilities} />
          <Field label="Why Right Candidate" value={eh.whyRightCandidate} />
        </ReviewCard>

        {/* ── Step 3: Experience ── */}
        <ReviewCard title="Experience & Equipment" step={3} onEdit={onEdit}>
          <Field label="Position Types" value={ex.positionTypes} />
          <Field label="Key Skills" value={ex.keySkills} />
          <Field label="Relevant Experience" value={ex.relevantExperience} />
          <Field label="Proud Achievement" value={ex.proudAchievement} />
          <Field label="HP Printer / Scanner" value={YesNo(ex.hasHPPrinter)} />
          <Field label="Check Printing Exp." value={YesNo(ex.checkPrintingExp)} />
        </ReviewCard>

        {/* ── Step 4: Work Preferences ── */}
        <ReviewCard title="Work Preferences" step={4} onEdit={onEdit}>
          <Field
            label="Employment Type"
            value={wp.employmentType === 'full-time' ? 'Full-time' : wp.employmentType === 'part-time' ? 'Part-time' : undefined}
          />
          <Field label="Flexible Hours" value={YesNo(wp.flexibleHours)} />
          <Field
            label="Work Arrangement"
            value={
              wp.workArrangement === 'remote'
                ? 'Remote'
                : wp.workArrangement === 'hybrid'
                ? 'Hybrid'
                : wp.workArrangement === 'on-site'
                ? 'On-site'
                : undefined
            }
          />
          <Field label="Role Type" value={wp.roleType} />
          <Field label="Tenure Intent" value={wp.tenureIntent} />
          {wp.companySizePreference && <Field label="Company Size" value={wp.companySizePreference} />}
          <Field
            label="Payment Preference"
            value={wp.paymentPreference === 'weekly' ? 'Weekly' : wp.paymentPreference === 'biweekly' ? 'Bi-weekly' : undefined}
          />
          <Field label="Mobile Carrier" value={wp.mobileCarrier} />
          <Field
            label="Mobile Plan"
            value={wp.mobilePlanType === 'prepaid' ? 'Prepaid' : wp.mobilePlanType === 'postpaid' ? 'Postpaid' : undefined}
          />
        </ReviewCard>

        {/* ── Step 5: Financial & Verification ── */}
        <ReviewCard title="Financial & Verification" step={5} onEdit={onEdit}>
          <Field label="Has Credit Card" value={YesNo(ai.hasCreditCard)} />
          {ai.creditCardBank && <Field label="Credit Card Bank" value={ai.creditCardBank} />}
          <Field label="Credit Card Debt" value={YesNo(ai.hasCreditCardDebt)} />
          <Field label="Credit Score" value={ai.creditScore} />
          <Field label="Bank Used" value={ai.bankUsed} />
          <Field label="Has 401k" value={YesNo(ai.has401k)} />
          {ai.plan401kProvider && <Field label="401k Provider" value={ai.plan401kProvider} />}
          <Field label="Filed Taxes" value={YesNo(ai.filedTaxes)} />
          <Field label="Military Service" value={
            ai.militaryService === 'yes' ? 'Yes' : ai.militaryService === 'no' ? 'No' : 'Prefer not to say'
          } />
          <Field label="Work Authorised" value={YesNo(ai.workAuthorized)} />
          <Field label="Training Willing" value={YesNo(ai.trainingWillingness)} />
          <Field label="ID.me Verified" value={YesNo(ai.hasIdMe)} />
          <Field label="SSN Provided" value={ai.ssn ? '●●●–●●–●●●●' : undefined} />
          <Field label="Address Confirmed" value={ai.addressConfirmed ? 'Yes — confirmed' : 'Not confirmed'} />
          <Field label="Policies Accepted" value={ai.policyAccepted ? 'Yes — accepted' : 'Not accepted'} />
          {ai.additionalInfo && <Field label="Additional Notes" value={ai.additionalInfo} />}
        </ReviewCard>

        {/* ── Uploaded Documents ── */}
        {(ex.resumeFileName || ex.portfolioFileName || ai.idFrontFileName || ai.idBackFileName || ai.ssnCardFileName) && (
          <ReviewCard title="Uploaded Documents" step={3} onEdit={onEdit}>
            {ex.resumeFileName && (
              <div className="flex items-center gap-3">
                <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-secondarytext">Resume</p>
                  <p className="text-sm text-brand-deeptext">{ex.resumeFileName}</p>
                </div>
              </div>
            )}
            {ex.portfolioFileName && (
              <div className="flex items-center gap-3">
                <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-secondarytext">Portfolio</p>
                  <p className="text-sm text-brand-deeptext">{ex.portfolioFileName}</p>
                </div>
              </div>
            )}
            {ai.idFrontFileName && (
              <div className="flex items-center gap-3">
                <div className="size-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <FileText size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-secondarytext">ID (Front)</p>
                  <p className="text-sm text-brand-deeptext">{ai.idFrontFileName}</p>
                </div>
              </div>
            )}
            {ai.idBackFileName && (
              <div className="flex items-center gap-3">
                <div className="size-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <FileText size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-secondarytext">ID (Back)</p>
                  <p className="text-sm text-brand-deeptext">{ai.idBackFileName}</p>
                </div>
              </div>
            )}
            {ai.ssnCardFileName && (
              <div className="flex items-center gap-3">
                <div className="size-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <FileText size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-secondarytext">SSN Card</p>
                  <p className="text-sm text-brand-deeptext">{ai.ssnCardFileName}</p>
                </div>
              </div>
            )}
          </ReviewCard>
        )}
      </div>

      {/* Declaration */}
      <div className="mt-6 p-5 rounded-xl bg-amber-50 border border-amber-100">
        <p className="text-sm font-semibold text-amber-800 mb-2">Before you submit</p>
        <p className="text-sm text-amber-700 leading-relaxed">
          Please review your information carefully before submitting your application. By submitting,
          you confirm that all information provided is accurate and complete to the best of your
          knowledge. Submission does not constitute an offer of employment.
        </p>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border">
        <Button type="button" variant="outline" size="lg" leftIcon={<ArrowLeft size={18} />} onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={onSubmit}
          isLoading={submitting}
          rightIcon={!submitting ? <Send size={18} /> : undefined}
        >
          Submit Application
        </Button>
      </div>
    </div>
  )
}
