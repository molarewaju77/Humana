import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Eye, FileText, ChevronLeft, ChevronRight, ChevronDown, X, RotateCw, Loader2 } from 'lucide-react'
import { fetchApplications } from '../../lib/storage'
import type { Application, ApplicationStatus } from '../../lib/types'
import { formatDate, getStatusLabel } from '../../lib/utils'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'

const ALL_STATUSES: ApplicationStatus[] = [
  'pending', 'under_review', 'approved', 'rejected', 'closed',
]

const PAGE_SIZE = 10

export default function AdminApplicationsPage() {
  const [allApps, setAllApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const { addToast } = useToast()

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const apps = await fetchApplications()
      setAllApps(apps)
    } catch (err: any) {
      console.error('Failed to load applications from Supabase:', err)
      addToast('error', 'Failed to load applications', err?.message || 'Check your database connection.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-deeptext">Applications</h1>
          <p className="text-xs text-brand-secondarytext mt-1">
            {loading ? 'Loading applications…' : `${filtered.length} ${filtered.length === 1 ? 'application' : 'applications'} found`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadData(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-white text-xs font-medium text-brand-deeptext hover:bg-brand-softbg transition-colors disabled:opacity-50"
          title="Refresh Applications"
        >
          <RotateCw size={13} className={refreshing ? 'animate-spin text-primary' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Refined Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-brand-border p-3.5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondarytext pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search by name, email, or reference number…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ paddingLeft: '2.625rem', paddingRight: '2.25rem' }}
            className="w-full h-10 text-base sm:text-xs text-brand-deeptext bg-white rounded-lg border border-brand-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-brand-secondarytext/60"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondarytext hover:text-brand-deeptext p-0.5 rounded transition-colors z-10"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative shrink-0 sm:w-52">
          <Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondarytext pointer-events-none z-10" />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus | 'all')}
            style={{ paddingLeft: '2.625rem', paddingRight: '2.25rem' }}
            className="w-full h-10 text-xs font-medium text-brand-deeptext bg-white rounded-lg border border-brand-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{getStatusLabel(s)}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondarytext pointer-events-none z-10" />
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-brand-secondarytext gap-2">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="text-sm">Loading applications from Supabase…</span>
          </div>
        ) : paginated.length === 0 ? (
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
                    {['Reference', 'Applicant', 'Email', 'Submitted', 'Status', 'View'].map((h) => (
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
                    <tr key={app.id} className="hover:bg-brand-softbg/60 transition-colors group">
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
                          className="inline-flex items-center justify-center size-8 rounded-lg text-brand-secondarytext hover:text-primary hover:bg-primary/10 transition-colors"
                          aria-label={`View details for ${app.referenceNumber}`}
                          title="View Application Details"
                        >
                          <Eye size={17} />
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
                <div
                  key={app.id}
                  className="p-4 space-y-3 hover:bg-brand-softbg/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {app.personalInfo.firstName?.[0]}{app.personalInfo.lastName?.[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-brand-deeptext truncate">
                          {app.personalInfo.firstName} {app.personalInfo.lastName}
                        </h3>
                        <p className="text-xs text-brand-secondarytext truncate">{app.personalInfo.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-brand-secondarytext pt-2 border-t border-brand-border/60">
                    <div>
                      <span className="font-mono font-medium text-brand-deeptext block">{app.referenceNumber}</span>
                      <span className="text-[11px]">Submitted {formatDate(app.submittedAt)}</span>
                    </div>

                    <Link
                      to={`/admin/applications/${app.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white font-medium text-xs shadow-xs hover:bg-primary-dark transition-all shrink-0"
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
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
