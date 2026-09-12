import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ArrowRight, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { getApplications } from '../../lib/storage'
import type { ApplicationStatus } from '../../lib/types'
import { formatDate, getStatusLabel } from '../../lib/utils'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'

const ALL_STATUSES: ApplicationStatus[] = [
  'submitted', 'under_review', 'interview', 'assessment', 'decision', 'closed',
]

const PAGE_SIZE = 10

export default function AdminApplicationsPage() {
  const allApps = useMemo(() => getApplications(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let apps = allApps
    if (statusFilter !== 'all') {
      apps = apps.filter((a) => a.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      apps = apps.filter(
        (a) =>
          `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.toLowerCase().includes(q) ||
          a.referenceNumber.toLowerCase().includes(q) ||
          a.personalInfo.email.toLowerCase().includes(q),
      )
    }
    return apps
  }, [allApps, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSearchChange(val: string) {
    setSearch(val)
    setPage(1)
  }
  function handleStatusChange(val: ApplicationStatus | 'all') {
    setStatusFilter(val)
    setPage(1)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-brand-deeptext">Applications</h1>
        <p className="text-sm text-brand-secondarytext mt-1">
          {filtered.length} {filtered.length === 1 ? 'application' : 'applications'} found
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-brand-border shadow-card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondarytext" />
          <input
            type="search"
            placeholder="Search by name, email, or reference number…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="field-input pl-9 h-10"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondarytext" />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus | 'all')}
            className="field-input pl-9 h-10 pr-8 appearance-none w-full sm:w-44"
          >
            <option value="all">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{getStatusLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / cards */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title="No applications found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-softbg">
                    {['Reference', 'Applicant', 'Email', 'Submitted', 'Status', ''].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-brand-secondarytext"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {paginated.map((app) => (
                    <tr key={app.id} className="hover:bg-brand-softbg transition-colors group">
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono font-semibold text-brand-deeptext">
                          {app.referenceNumber}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {app.personalInfo.firstName?.[0]}{app.personalInfo.lastName?.[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-brand-deeptext">
                            {app.personalInfo.firstName} {app.personalInfo.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-brand-secondarytext">
                        {app.personalInfo.email}
                      </td>
                      <td className="px-5 py-4 text-sm text-brand-secondarytext whitespace-nowrap">
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/applications/${app.id}`}
                          className="flex items-center justify-center size-8 rounded-lg text-brand-secondarytext hover:bg-primary/10 hover:text-primary transition-colors"
                          aria-label={`View application ${app.referenceNumber}`}
                        >
                          <ArrowRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-brand-border">
              {paginated.map((app) => (
                <Link
                  key={app.id}
                  to={`/admin/applications/${app.id}`}
                  className="block px-5 py-4 hover:bg-brand-softbg transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-deeptext">
                        {app.personalInfo.firstName} {app.personalInfo.lastName}
                      </p>
                      <p className="text-xs font-mono text-brand-secondarytext mt-0.5">{app.referenceNumber}</p>
                      <p className="text-xs text-brand-secondarytext mt-1">{formatDate(app.submittedAt)}</p>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-brand-border">
            <p className="text-xs text-brand-secondarytext">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="flex items-center justify-center size-8 rounded-lg border border-brand-border text-brand-secondarytext hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="flex items-center justify-center size-8 rounded-lg border border-brand-border text-brand-secondarytext hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
