import type { ApplicationStatus } from './types'

export function generateReferenceNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(100000 + Math.random() * 900000)
  return `APP-${year}-${random}`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function getStatusLabel(status: ApplicationStatus | string): string {
  const labels: Record<string, string> = {
    pending: 'Pending',
    submitted: 'Pending',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    closed: 'Closed',
  }
  return labels[status] || 'Pending'
}

export function getStatusColor(status: ApplicationStatus | string): string {
  const colors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    submitted: 'bg-amber-50 text-amber-700 border-amber-200',
    under_review: 'bg-blue-50 text-blue-700 border-blue-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    closed: 'bg-gray-50 text-gray-600 border-gray-200',
  }
  return colors[status] || 'bg-amber-50 text-amber-700 border-amber-200'
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const MAX_FILE_SIZE_MB = 5

export function validateFile(file: File): string | null {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return 'Please upload a PDF, DOC, or DOCX file.'
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `File must be smaller than ${MAX_FILE_SIZE_MB}MB.`
  }
  return null
}
