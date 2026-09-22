import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Briefcase,
  Star,
  Settings,
  ShieldCheck,
  FileText,
  Clock,
  Send,
  Plus,
  ChevronDown,
  DollarSign,
  Check,
  ExternalLink,
  Download,
  Loader2,
  Image as ImageIcon,
  Copy,
  CheckCircle,
  FileCheck,
} from 'lucide-react'
import { fetchApplicationById, updateApplicationStatus, addAdminNote } from '../../lib/storage'
import { supabase, BUCKET_NAME } from '../../lib/supabase'
import type { Application, ApplicationStatus } from '../../lib/types'
import { formatDateTime, getStatusLabel } from '../../lib/utils'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'

const ALL_STATUSES: ApplicationStatus[] = [
  'pending', 'under_review', 'approved', 'rejected', 'closed',
]

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    addToast('success', 'Copied to clipboard', label ? `Copied ${label}` : undefined)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded text-brand-secondarytext hover:text-brand-deeptext hover:bg-black/5 transition-colors shrink-0"
      title={`Copy ${label || 'text'}`}
    >
      {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
    </button>
  )
}

function DocumentRow({ label, url, icon: Icon }: { label: string; url: string; icon: any }) {
  const [downloading, setDownloading] = useState(false)
  const { addToast } = useToast()

  const isDataUrl = url.startsWith('data:')
  const isHttpUrl = url.startsWith('http://') || url.startsWith('https://')
  const finalUrl = isHttpUrl || isDataUrl
    ? url
    : supabase.storage.from(BUCKET_NAME).getPublicUrl(url).data.publicUrl

  const cleanName = isDataUrl
    ? `${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`
    : decodeURIComponent(finalUrl.split('/').pop()?.replace(/^\d+_/, '') || url)

  const isImage = isDataUrl || /\.(jpg|jpeg|png|webp|gif)$/i.test(cleanName)

  async function handleDownload(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDownloading(true)
    try {
      if (isDataUrl) {
        const a = document.createElement('a')
        a.href = finalUrl
        a.download = cleanName || 'document.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        addToast('success', 'Downloaded successfully', `Saved ${cleanName}`)
        return
      }

      const res = await fetch(finalUrl)
      if (!res.ok) throw new Error('Network response was not ok')
      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = cleanName || 'document'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(blobUrl)
      addToast('success', 'Downloaded successfully', `Saved ${cleanName}`)
    } catch {
      window.open(finalUrl, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  function handleView(e: React.MouseEvent) {
    if (isDataUrl) {
      e.preventDefault()
      fetch(finalUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob)
          window.open(blobUrl, '_blank')
        })
        .catch(() => window.open(finalUrl, '_blank'))
    }
  }

  return (
    <div className="flex flex-col p-3.5 rounded-xl border border-brand-border/80 bg-brand-softbg/60 gap-3 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        {isImage && (finalUrl.startsWith('http') || isDataUrl) ? (
          <div className="size-10 rounded-lg overflow-hidden border border-brand-border bg-white shrink-0 mt-0.5">
            <img src={finalUrl} alt={label} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            {isImage ? <ImageIcon size={18} /> : <Icon size={18} />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-brand-secondarytext uppercase tracking-wider">{label}</p>
          <p className="text-xs font-medium text-brand-deeptext break-all mt-0.5" title={cleanName}>
            {cleanName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-brand-border/40">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-xs transition-colors disabled:opacity-50"
        >
          {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          <span>Download</span>
        </button>
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleView}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-deeptext bg-white hover:bg-brand-softbg rounded-lg border border-brand-border shadow-xs transition-colors"
        >
          <ExternalLink size={13} />
          <span>View</span>
        </a>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  copyValue,
}: {
  label: string
  value?: string | null
  copyValue?: string
}) {
  if (!value) return null
  const textToCopy = copyValue || value

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-2.5 border-b border-brand-border/60 last:border-0 items-start sm:items-center justify-between w-full min-w-0">
      <span className="text-xs font-semibold text-brand-secondarytext uppercase tracking-wider sm:w-44 shrink-0">
        {label}
      </span>
      <div className="flex items-start sm:items-center gap-1.5 text-xs text-brand-deeptext font-normal leading-relaxed min-w-0 flex-1 justify-start sm:justify-end w-full sm:w-auto">
        <span className="break-all sm:break-words font-normal min-w-0">{value}</span>
        {textToCopy && (
          <CopyButton text={textToCopy} label={label} />
        )}
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-brand-border overflow-hidden w-full max-w-full min-w-0">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-brand-border/60 bg-brand-softbg/60 min-w-0">
        <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon size={14} />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-deeptext truncate">{title}</h2>
      </div>
      <div className="px-4 py-3 w-full max-w-full min-w-0">{children}</div>
    </div>
  )
}

function maskSSN(ssn?: string) {
  if (!ssn) return undefined
  const cleaned = ssn.replace(/\D/g, '')
  if (cleaned.length >= 4) {
    return `***-**-${cleaned.slice(-4)}`
  }
  return '***-**-****'
}

export default function AdminApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addToast } = useToast()

  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchApplicationById(id)
      .then((data) => {
        setApp(data)
        if (data) {
          setSelectedStatus(data.status)
        }
      })
      .catch((err: any) => {
        console.error('Failed to load application from Supabase:', err)
        addToast('error', 'Failed to load application', err?.message || 'Check database connection')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, addToast])

  async function handleStatusUpdate() {
    if (!selectedStatus || selectedStatus === app?.status || !app) return
    setUpdatingStatus(true)
    try {
      const updated = await updateApplicationStatus(app.id, selectedStatus as ApplicationStatus)
      setApp(updated)
      addToast('success', 'Status updated', `Application moved to ${getStatusLabel(selectedStatus as ApplicationStatus)}.`)
    } catch (err: any) {
      console.error('Failed to update application status:', err)
      addToast('error', 'Status update failed', err?.message || 'Could not update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleAddNote() {
    if (!newNote.trim() || !app) return
    setSavingNote(true)
    try {
      const createdNote = await addAdminNote(app.id, newNote.trim())
      setApp((prev) => (prev ? { ...prev, adminNotes: [...prev.adminNotes, createdNote] } : prev))
      setNewNote('')
      addToast('success', 'Note added', 'Internal recruiter note saved to Supabase.')
    } catch (err: any) {
      console.error('Failed to add note:', err)
      addToast('error', 'Failed to add note', err?.message || 'Could not save note')
    } finally {
      setSavingNote(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <Loader2 size={24} className="animate-spin text-primary" />
        <p className="text-sm font-medium text-brand-deeptext">Loading application from Supabase…</p>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-base font-semibold text-brand-deeptext">Application not found</p>
        <p className="text-xs text-brand-secondarytext mt-1">This application may have been removed or does not exist in Supabase.</p>
        <Link to="/admin/applications" className="mt-5">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={14} />}>Back to Applications</Button>
        </Link>
      </div>
    )
  }

  const { personalInfo: pi, employmentHistory: eh, experience: ex, workPreferences: wp, additionalInfo: ai } = app
  const fullName = `${pi.firstName} ${pi.lastName}`
  const fullAddress = [pi.address, pi.city, pi.state, pi.zipCode, pi.country].filter(Boolean).join(', ')

  return (
    <div className="space-y-5 animate-fade-in pb-12 w-full max-w-full min-w-0">
      {/* Back + header */}
      <div className="w-full min-w-0">
        <Link
          to="/admin/applications"
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-brand-deeptext bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg hover:bg-brand-softbg transition-all cursor-pointer shadow-2xs mb-3"
        >
          <ArrowLeft size={13} className="text-brand-secondarytext" />
          <span>Back to Applications</span>
        </Link>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-brand-border space-y-3.5 w-full min-w-0">
          {/* Top Row: Avatar + Candidate Name + Top Right Status Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="size-10 sm:size-11 rounded-xl bg-primary/10 text-primary font-semibold text-sm sm:text-base flex items-center justify-center shrink-0">
                {pi.firstName[0]}{pi.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-base sm:text-lg font-semibold text-brand-deeptext truncate">
                    {fullName}
                  </h1>
                  <CopyButton text={fullName} label="Full Name" />
                </div>
                {/* Desktop metadata */}
                <div className="text-[11px] text-brand-secondarytext hidden sm:flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="font-mono">Ref ID: {app.referenceNumber}</span>
                  <CopyButton text={app.referenceNumber} label="Reference ID" />
                  <span className="text-brand-border">•</span>
                  <span className="truncate max-w-[200px]">{pi.email}</span>
                  <CopyButton text={pi.email} label="Email Address" />
                  <span className="text-brand-border">•</span>
                  <span>Submitted {formatDateTime(app.submittedAt)}</span>
                </div>
              </div>
            </div>

            {/* Status Badge in Top Right */}
            <div className="shrink-0">
              <StatusBadge status={app.status} size="sm" />
            </div>
          </div>

          {/* Mobile Metadata Box (< sm viewports) */}
          <div className="sm:hidden bg-brand-softbg/60 rounded-lg p-2.5 space-y-1.5 text-[11px] border border-brand-border w-full min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-brand-secondarytext font-medium">Ref ID</span>
              <div className="flex items-center gap-1 font-mono font-medium text-brand-deeptext">
                <span>{app.referenceNumber}</span>
                <CopyButton text={app.referenceNumber} label="Reference ID" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-brand-secondarytext font-medium">Email</span>
              <div className="flex items-center gap-1 min-w-0 text-brand-deeptext">
                <span className="truncate max-w-[180px] font-medium">{pi.email}</span>
                <CopyButton text={pi.email} label="Email Address" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-brand-secondarytext font-medium">Submitted</span>
              <span className="text-brand-deeptext font-medium">{formatDateTime(app.submittedAt)}</span>
            </div>
          </div>

          {/* Bottom Action Row: Status Selector Dropdown + Update Button */}
          <div className="flex items-center gap-2 pt-2 border-t border-brand-border/50">
            <div className="relative flex-1 sm:w-48 sm:flex-none">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                className="w-full h-9 pl-3 pr-8 text-xs font-medium text-brand-deeptext bg-white rounded-lg border border-brand-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-secondarytext pointer-events-none" />
            </div>
            <Button
              size="sm"
              onClick={handleStatusUpdate}
              isLoading={updatingStatus}
              disabled={!selectedStatus || selectedStatus === app.status || updatingStatus}
              className="h-9 text-xs px-3.5 font-medium shrink-0 rounded-lg"
            >
              Update Status
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 w-full min-w-0">
        {/* Main detail content */}
        <div className="space-y-4 w-full min-w-0">
          {/* Step 1: Personal Information */}
          <Section title="1. Personal Information" icon={User}>
            <DetailRow label="Full Name" value={fullName} />
            <DetailRow label="Date of Birth" value={pi.dateOfBirth} />
            <DetailRow label="Gender" value={pi.gender} />
            <DetailRow label="Marital Status" value={pi.maritalStatus} />
            <DetailRow label="Self Introduction" value={pi.selfIntroduction} />
            <DetailRow label="Email Address" value={pi.email} />
            <DetailRow label="Phone Number" value={pi.phone} />
            <DetailRow label="Full Address" value={fullAddress} />
            <DetailRow label="LinkedIn Profile" value={pi.linkedin} />
            <DetailRow label="Portfolio URL" value={pi.portfolio} />
          </Section>

          {/* Step 2: Employment History */}
          <Section title="2. Employment History" icon={Briefcase}>
            <DetailRow label="Currently Employed" value={eh.currentlyEmployed === 'yes' ? 'Yes' : 'No'} />
            <DetailRow label="How Obtained Position" value={eh.howObtained} />
            <DetailRow label="Previous Job Titles" value={eh.previousTitles} />
            <DetailRow label="Previous Employers" value={eh.previousEmployers} />
            <DetailRow label="Years of Experience" value={eh.yearsExperience} />
            <DetailRow label="Key Responsibilities" value={eh.responsibilities} />
            <DetailRow label="Why Right Candidate" value={eh.whyRightCandidate} />
          </Section>

          {/* Step 3: Experience & Technical Skills */}
          <Section title="3. Experience & Skills" icon={Star}>
            <DetailRow label="Position Types" value={ex.positionTypes} />
            <DetailRow label="Key Skills" value={ex.keySkills} />
            <DetailRow label="Relevant Experience" value={ex.relevantExperience} />
            <DetailRow label="Proud Achievement" value={ex.proudAchievement} />
            <DetailRow label="Owns HP Printer" value={ex.hasHPPrinter === 'yes' ? 'Yes' : 'No'} />
            <DetailRow label="Check Printing Exp." value={ex.checkPrintingExp === 'yes' ? 'Yes' : 'No'} />
          </Section>

          {/* Step 4: Work Preferences */}
          <Section title="4. Work Preferences & Logistics" icon={Settings}>
            <DetailRow label="Employment Type" value={wp.employmentType === 'full-time' ? 'Full-Time' : 'Part-Time'} />
            <DetailRow label="Flexible Hours" value={wp.flexibleHours === 'yes' ? 'Yes' : 'No'} />
            <DetailRow
              label="Work Arrangement"
              value={wp.workArrangement === 'remote' ? 'Remote' : wp.workArrangement === 'hybrid' ? 'Hybrid' : wp.workArrangement || 'N/A'}
            />
            <DetailRow label="Role Preference" value={wp.roleType} />
            <DetailRow label="Tenure Intent" value={wp.tenureIntent} />
            <DetailRow label="Company Size Pref." value={wp.companySizePreference} />
            <DetailRow label="Payment Frequency" value={wp.paymentPreference === 'weekly' ? 'Weekly' : 'Bi-weekly'} />
            <DetailRow label="Mobile Carrier" value={wp.mobileCarrier} />
            <DetailRow label="Mobile Plan Type" value={wp.mobilePlanType === 'postpaid' ? 'Postpaid (Contract)' : 'Prepaid'} />
          </Section>

          {/* Step 5: Financial Background & Eligibility */}
          <Section title="5. Financial Background & Eligibility" icon={DollarSign}>
            <DetailRow label="Has Credit Card" value={ai.hasCreditCard === 'yes' ? 'Yes' : 'No'} />
            {ai.creditCardBank && <DetailRow label="Credit Card Bank" value={ai.creditCardBank} />}
            <DetailRow label="Has Credit Card Debt" value={ai.hasCreditCardDebt === 'yes' ? 'Yes' : 'No'} />
            <DetailRow label="Credit Score Range" value={ai.creditScore} />
            <DetailRow label="Primary Bank" value={ai.bankUsed} />
            <DetailRow label="Has 401(k) Plan" value={ai.has401k === 'yes' ? 'Yes' : 'No'} />
            {ai.plan401kProvider && <DetailRow label="401(k) Provider" value={ai.plan401kProvider} />}
            <DetailRow label="Filed Prior Year Taxes" value={ai.filedTaxes === 'yes' ? 'Yes' : 'No'} />
            <DetailRow
              label="Military Service"
              value={ai.militaryService === 'yes' ? 'Yes' : ai.militaryService === 'no' ? 'No' : 'Prefer not to say'}
            />
            <DetailRow label="US Work Authorized" value={ai.workAuthorized === 'yes' ? 'Yes' : 'No'} />
            <DetailRow label="Willing to Train" value={ai.trainingWillingness === 'yes' ? 'Yes' : 'No'} />
            {ai.additionalInfo && <DetailRow label="Additional Remarks" value={ai.additionalInfo} />}
          </Section>

          {/* Step 6: Identity Verification & Documents */}
          <Section title="6. Identity Verification & Documents" icon={ShieldCheck}>
            <DetailRow label="ID.me Account" value={ai.hasIdMe === 'yes' ? 'Verified / Existing' : 'No Account'} />
            <DetailRow label="Social Security Number" value={maskSSN(ai.ssn)} copyValue={ai.ssn} />
            <DetailRow label="Address Confirmed" value={ai.addressConfirmed ? 'Yes (Confirmed)' : 'No'} />
            <DetailRow label="Terms & Policy Accepted" value={ai.policyAccepted ? 'Yes (Accepted)' : 'No'} />

            {/* Document attachments preview */}
            <div className="mt-3 pt-3 border-t border-brand-border/60 space-y-2.5">
              <p className="text-xs font-semibold text-brand-deeptext uppercase tracking-wider">Submitted Documents</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ex.resumeFileName && (
                  <DocumentRow label="Resume" url={ex.resumeFileName} icon={FileText} />
                )}

                {ex.portfolioFileName && (
                  <DocumentRow label="Portfolio File" url={ex.portfolioFileName} icon={FileCheck} />
                )}

                {ai.idFrontFileName && (
                  <DocumentRow label="ID Document (Front)" url={ai.idFrontFileName} icon={ShieldCheck} />
                )}

                {ai.idBackFileName && (
                  <DocumentRow label="ID Document (Back)" url={ai.idBackFileName} icon={ShieldCheck} />
                )}

                {ai.ssnCardFileName && (
                  <DocumentRow label="SSN Card Document" url={ai.ssnCardFileName} icon={CheckCircle} />
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 w-full min-w-0">
          {/* Status Timeline */}
          <div className="bg-white rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-primary" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-deeptext">Application History</h2>
            </div>
            <ol className="space-y-2.5">
              {app.statusHistory.map((entry, i) => (
                <li key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className="size-1.5 rounded-full bg-primary mt-1 shrink-0" />
                    {i < app.statusHistory.length - 1 && (
                      <div className="w-0.5 bg-brand-border/60 flex-1 mt-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-medium text-brand-deeptext">
                      {getStatusLabel(entry.status)}
                    </p>
                    <p className="text-[11px] text-brand-secondarytext mt-0.5">{formatDateTime(entry.changedAt)}</p>
                    {entry.note && (
                      <p className="text-[11px] text-brand-secondarytext mt-0.5 italic">{entry.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Internal Recruiter Notes */}
          <div className="bg-white rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Send size={14} className="text-primary" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-deeptext">Internal Notes</h2>
            </div>
            <p className="text-[11px] text-brand-secondarytext mb-2.5">
              Private recruiter notes (saved directly to Supabase).
            </p>

            {app.adminNotes.length === 0 ? (
              <p className="text-xs text-brand-secondarytext italic py-1.5">No notes added yet.</p>
            ) : (
              <ul className="space-y-2 mb-3">
                {app.adminNotes.map((note) => (
                  <li key={note.id} className="rounded-lg bg-brand-softbg/70 border border-brand-border/60 p-2.5">
                    <p className="text-xs text-brand-deeptext leading-relaxed font-normal flex items-start justify-between gap-2">
                      <span>{note.content}</span>
                      <CopyButton text={note.content} label="Internal Note" />
                    </p>
                    <p className="text-[10px] text-brand-secondarytext mt-1">{formatDateTime(note.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add internal note…"
              className="field-input resize-none h-20 text-xs py-2"
              maxLength={500}
            />
            <Button
              size="sm"
              onClick={handleAddNote}
              isLoading={savingNote}
              disabled={!newNote.trim() || savingNote}
              leftIcon={<Plus size={13} />}
              className="mt-2 w-full text-xs h-8"
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
