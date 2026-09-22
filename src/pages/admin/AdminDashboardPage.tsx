import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  Search,
  UserCheck,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCw,
  Loader2,
} from "lucide-react";
import { fetchApplications, calculateStats } from "../../lib/storage";
import type { Application } from "../../lib/types";
import { formatDate } from "../../lib/utils";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../components/ui/Toast";

export default function AdminDashboardPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToast } = useToast();

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await fetchApplications();
      setApps(data);
    } catch (error: any) {
      console.error("Dashboard fetch applications failed:", error);
      addToast(
        "error",
        "Failed to load applications",
        error?.message || "Check your Supabase connection and database policies."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => calculateStats(apps), [apps]);
  const recentApps = useMemo(() => apps.slice(0, 5), [apps]);

  const statCards = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: FileText,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      label: "Under Review",
      value: stats.underReview,
      icon: Search,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: UserCheck,
      color: "bg-teal-50 text-teal-600 border-teal-100",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600 border-green-100",
    },
    {
      label: "Closed",
      value: stats.closed,
      icon: XCircle,
      color: "bg-gray-50 text-gray-500 border-gray-100",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page title & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-deeptext">Dashboard</h1>
          <p className="text-sm text-brand-secondarytext mt-1">
            Overview of all recruitment activity from Supabase
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadData(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-white text-xs font-medium text-brand-deeptext hover:bg-brand-softbg transition-colors disabled:opacity-50"
          title="Refresh Data"
        >
          <RotateCw size={13} className={refreshing ? "animate-spin text-primary" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-brand-border shadow-card p-5"
          >
            <div
              className={`size-10 rounded-xl border flex items-center justify-center mb-3 ${color}`}
            >
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-brand-deeptext tabular-nums">
              {loading ? "—" : value}
            </p>
            <p className="text-xs text-brand-secondarytext mt-1 leading-tight">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <h2 className="text-base font-semibold text-brand-deeptext">
            Recent Applications
          </h2>
          <Link
            to="/admin/applications"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-brand-secondarytext gap-2">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="text-sm">Loading applications from Supabase…</span>
          </div>
        ) : recentApps.length === 0 ? (
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
                      {app.personalInfo.firstName?.[0]}
                      {app.personalInfo.lastName?.[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-deeptext truncate">
                      {app.personalInfo.firstName} {app.personalInfo.lastName}
                    </p>
                    <p className="text-xs text-brand-secondarytext">
                      {app.referenceNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <StatusBadge status={app.status} size="sm" />
                  <span className="text-xs text-brand-secondarytext hidden sm:block">
                    {formatDate(app.submittedAt)}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-brand-secondarytext group-hover:text-primary transition-colors"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
