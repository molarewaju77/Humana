import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Briefcase,
  Star,
  Settings,
  Info,
  FileText,
  Clock,
  Send,
  Plus,
  ChevronDown,
} from 'lucide-react'
import { getApplicationById, updateApplicationStatus, addAdminNote } from '../../lib/storage'
import type { ApplicationStatus } from '../../lib/types'
import { formatDateTime, getStatusLabel, cn } from '../../lib/utils'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'

const ALL_STATUSES: ApplicationStatus[] = [
  'submitted', 'under_review', 'interview', 'assessment', 'decision', 'closed',
]

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-2.5 border-b border-brand-border last:border-0">
      <span className="text-xs font-semibold text-brand-secondarytext uppercase tracking-wide sm:w-44 shrink-0">{label}</span>
      <span className="text-sm text-brand-deeptext leading-relaxed">{value}</span>
    </div>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-border bg-brand-softbg">
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={15} />
        </div>
        <h2 className="text-sm font-semibold text-brand-deeptext">{title}</h2>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}

export default function AdminApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [app, setApp] = useState(() => (id ? getApplicationById(id) : undefined))
  const [newNote, setNewNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>(app?.status || '')

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-brand-deeptext">Application not found</p>
        <p className="text-sm text-brand-secondarytext mt-2">This application may have been removed.</p>
        <Link to="/admin/applications" className="mt-6">
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />}>Back to Applications</Button>
        </Link>
      </div>
    )
  }

  const { personalInfo: pi, employmentHistory: eh, experience: ex, workPreferences: wp, additionalInfo: ai } = app

  function handleStatusUpdate() {
    if (!selectedStatus || selectedStatus === app!.status) return
    const updated = updateApplicationStatus(app!.id, selectedStatus as ApplicationStatus)
    if (updated) {
      setApp(updated)
      addToast('success', 'Status updated', `Application moved to ${getStatusLabel(selectedStatus as ApplicationStatus)}.`)
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return
    setSavingNote(true)
    await new Promise((r) => setTimeout(r, 400))
    const updated = addAdminNote(app!.id, newNote.trim())
    if (updated) {
      setApp(updated)
      setNewNote('')
      addToast('success', 'Note added')
    }
    setSavingNote(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + header */}
      <div>
        <Link
          to="/admin/applications"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-secondarytext hover:text-brand-deeptext transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Applications
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-deeptext">
              {pi.firstName} {pi.lastName}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-mono text-brand-secondarytext">{app.referenceNumber}</span>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-xs text-brand-secondarytext mt-1.5">
              Submitted {formatDateTime(app.submittedAt)}
            </p>
          </div>

          {/* Status change */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                className="field-input h-10 pr-8 text-sm appearance-none"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-secondarytext pointer-events-none" />
            </div>
            <Button
              size="md"
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || selectedStatus === app.status}
            >
              Update
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main content */}
        <div className="space-y-5">
          <Section title="Personal Information" icon={User}>
            <DetailRow label="Full Name" value={`${pi.firstName} ${pi.lastName}`} />
            <DetailRow label="Email" value={pi.email} />
            <DetailRow label="Phone" value={pi.phone} />
            <DetailRow label="Location" value={[pi.city, pi.state, pi.country].filter(Boolean).join(', ')} />
            {pi.linkedin && <DetailRow label="LinkedIn" value={pi.linkedin} />}
            {pi.portfolio && <DetailRow label="Portfolio" value={pi.portfolio} />}
          </Section>

          <Section title="Employment History" icon={Briefcase}>
            <DetailRow label="Currently Employed" value={eh.currentlyEmployed === 'yes' ? 'Yes' : 'No'} />
            <DetailRow label="How Obtained" value={eh.howObtained} />
            <DetailRow label="Previous Titles" value={eh.previousTitles} />
            <DetailRow label="Previous Employers" value={eh.previousEmployers} />
            <DetailRow label="Years of Experience" value={eh.yearsExperience} />
            <DetailRow label="Responsibilities" value={eh.responsibilities} />
          </Section>

          <Section title="Experience & Skills" icon={Star}>
            <DetailRow label="Position Types" value={ex.positionTypes} />
            <DetailRow label="Key Skills" value={ex.keySkills} />
            <DetailRow label="Relevant Experience" value={ex.relevantExperience} />
            <DetailRow label="Proud Achievement" value={ex.proudAchievement} />
          </Section>

          <Section title="Work Preferences" icon={Settings}>
            <DetailRow label="Flexible Hours" value={wp.flexibleHours === 'yes' ? 'Yes' : 'No'} />
            <DetailRow label="Employment Type" value={wp.employmentType === 'full-time' ? 'Full-time' : 'Part-time'} />
            <DetailRow
              label="Work Arrangement"
              value={wp.workArrangement === 'remote' ? 'Remote' : wp.workArrangement === 'hybrid' ? 'Hybrid' : 'On-site'}
            />
            <DetailRow label="Role Type" value={wp.roleType} />
            <DetailRow label="Tenure Intent" value={wp.tenureIntent} />
          </Section>

          <Section title="Additional Information" icon={Info}>
            <DetailRow
              label="Military Service"
              value={ai.militaryService === 'yes' ? 'Yes' : ai.militaryService === 'no' ? 'No' : 'Prefer not to say'}
            />
            <DetailRow label="Work Authorised" value={ai.workAuthorized === 'yes' ? 'Yes' : 'No'} />
            <DetailRow label="Training Willing" value={ai.trainingWillingness === 'yes' ? 'Yes' : 'No'} />
            {ai.additionalInfo && <DetailRow label="Notes" value={ai.additionalInfo} />}
          </Section>

          {(ex.resumeFileName || ex.portfolioFileName) && (
            <Section title="Uploaded Documents" icon={FileText}>
              {ex.resumeFileName && (
                <div className="flex items-center gap-3 py-2">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <FileText size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-brand-secondarytext font-semibold">Resume</p>
                    <p className="text-sm text-brand-deeptext">{ex.resumeFileName}</p>
                  </div>
                </div>
              )}
              {ex.portfolioFileName && (
                <div className="flex items-center gap-3 py-2">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <FileText size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-brand-secondarytext font-semibold">Portfolio</p>
                    <p className="text-sm text-brand-deeptext">{ex.portfolioFileName}</p>
                  </div>
                </div>
              )}
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} className="text-primary" />
              <h2 className="text-sm font-semibold text-brand-deeptext">Application Timeline</h2>
            </div>
            <ol className="space-y-3">
              {app.statusHistory.map((entry, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    {i < app.statusHistory.length - 1 && (
                      <div className="w-0.5 bg-brand-border flex-1 mt-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs font-semibold text-brand-deeptext">
                      {getStatusLabel(entry.status)}
                    </p>
                    <p className="text-xs text-brand-secondarytext mt-0.5">{formatDateTime(entry.changedAt)}</p>
                    {entry.note && (
                      <p className="text-xs text-brand-secondarytext mt-1 italic">{entry.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Recruiter notes — internal only */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Send size={15} className="text-primary" />
              <h2 className="text-sm font-semibold text-brand-deeptext">Internal Notes</h2>
            </div>
            <p className="text-xs text-brand-secondarytext mb-3">
              Notes are for internal use only and are never visible to applicants.
            </p>

            {app.adminNotes.length === 0 ? (
              <p className="text-xs text-brand-secondarytext italic">No notes yet.</p>
            ) : (
              <ul className="space-y-3 mb-4">
                {app.adminNotes.map((note) => (
                  <li key={note.id} className="rounded-xl bg-brand-softbg border border-brand-border p-3">
                    <p className="text-sm text-brand-deeptext leading-relaxed">{note.content}</p>
                    <p className="text-xs text-brand-secondarytext mt-1.5">{formatDateTime(note.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add an internal note…"
              className="field-input resize-none h-24 text-sm"
              maxLength={500}
            />
            <Button
              size="sm"
              onClick={handleAddNote}
              isLoading={savingNote}
              disabled={!newNote.trim()}
              leftIcon={<Plus size={14} />}
              className="mt-2 w-full"
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
