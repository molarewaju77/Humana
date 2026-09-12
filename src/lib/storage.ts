import type { Application, ApplicationStatus, AdminNote, StatusHistoryEntry } from './types'

const APPLICATIONS_KEY = 'hamana_applications'

export function getApplications(): Application[] {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY)
    return raw ? (JSON.parse(raw) as Application[]) : []
  } catch {
    return []
  }
}

export function getApplicationById(id: string): Application | undefined {
  return getApplications().find((app) => app.id === id)
}

export function saveApplication(app: Application): void {
  const apps = getApplications()
  const existingIndex = apps.findIndex((a) => a.id === app.id)
  if (existingIndex >= 0) {
    apps[existingIndex] = app
  } else {
    apps.unshift(app)
  }
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps))
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  note?: string,
): Application | undefined {
  const apps = getApplications()
  const index = apps.findIndex((a) => a.id === id)
  if (index < 0) return undefined

  const entry: StatusHistoryEntry = {
    status,
    changedAt: new Date().toISOString(),
    note,
  }

  apps[index] = {
    ...apps[index],
    status,
    statusHistory: [...apps[index].statusHistory, entry],
  }

  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps))
  return apps[index]
}

export function addAdminNote(id: string, content: string): Application | undefined {
  const apps = getApplications()
  const index = apps.findIndex((a) => a.id === id)
  if (index < 0) return undefined

  const note: AdminNote = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
  }

  apps[index] = {
    ...apps[index],
    adminNotes: [...apps[index].adminNotes, note],
  }

  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps))
  return apps[index]
}

export function getApplicationStats() {
  const apps = getApplications()
  return {
    total: apps.length,
    submitted: apps.filter((a) => a.status === 'submitted').length,
    underReview: apps.filter((a) => a.status === 'under_review').length,
    interview: apps.filter((a) => a.status === 'interview').length,
    assessment: apps.filter((a) => a.status === 'assessment').length,
    decision: apps.filter((a) => a.status === 'decision').length,
    closed: apps.filter((a) => a.status === 'closed').length,
  }
}
