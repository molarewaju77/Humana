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

export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    interview: 'Interview',
    assessment: 'Assessment',
    decision: 'Decision',
    closed: 'Closed',
  }
  return labels[status]
}

export function getStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    under_review: 'bg-amber-50 text-amber-700 border-amber-200',
    interview: 'bg-purple-50 text-purple-700 border-purple-200',
    assessment: 'bg-orange-50 text-orange-700 border-orange-200',
    decision: 'bg-teal-50 text-teal-700 border-teal-200',
    closed: 'bg-gray-50 text-gray-600 border-gray-200',
  }
  return colors[status]
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
