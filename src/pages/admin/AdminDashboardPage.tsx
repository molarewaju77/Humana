import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Clock, Search, UserCheck, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { getApplications, getApplicationStats } from '../../lib/storage'
import { formatDate } from '../../lib/utils'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminDashboardPage() {
  const stats = useMemo(() => getApplicationStats(), [])
  const recentApps = useMemo(() => getApplications().slice(0, 5), [])

  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: FileText, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Submitted', value: stats.submitted, icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Under Review', value: stats.underReview, icon: Search, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { label: 'Interview', value: stats.interview, icon: UserCheck, color: 'bg-teal-50 text-teal-600 border-teal-100' },
    { label: 'Decision', value: stats.decision, icon: CheckCircle, color: 'bg-green-50 text-green-600 border-green-100' },
    { label: 'Closed', value: stats.closed, icon: XCircle, color: 'bg-gray-50 text-gray-500 border-gray-100' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-brand-deeptext">Dashboard</h1>
        <p className="text-sm text-brand-secondarytext mt-1">Overview of all recruitment activity</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-brand-border shadow-card p-5">
            <div className={`size-10 rounded-xl border flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-brand-deeptext tabular-nums">{value}</p>
            <p className="text-xs text-brand-secondarytext mt-1 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <h2 className="text-base font-semibold text-brand-deeptext">Recent Applications</h2>
          <Link
            to="/admin/applications"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title="No applications yet"
            description="Applications will appear here once candidates start submitting."
          />
        ) : (
          <div className="divide-y divide-brand-border">
            {recentApps.map((app) => (
              <Link
                key={app.id}
                to={`/admin/applications/${app.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-brand-softbg transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {app.personalInfo.firstName?.[0]}{app.personalInfo.lastName?.[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-deeptext truncate">
                      {app.personalInfo.firstName} {app.personalInfo.lastName}
                    </p>
                    <p className="text-xs text-brand-secondarytext">{app.referenceNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <StatusBadge status={app.status} size="sm" />
                  <span className="text-xs text-brand-secondarytext hidden sm:block">{formatDate(app.submittedAt)}</span>
                  <ArrowRight size={14} className="text-brand-secondarytext group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
