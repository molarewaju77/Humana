// Application Status
export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'interview'
  | 'assessment'
  | 'decision'
  | 'closed'

// Personal Info
export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender?: string
  maritalStatus: string
  selfIntroduction: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  socialHandle: 'yes' | 'no'
  linkedin?: string
  portfolio?: string
}

// Employment History
export interface EmploymentHistory {
  currentlyEmployed: 'yes' | 'no'
  howObtained: string
  previousTitles: string
  previousEmployers: string
  responsibilities: string
  yearsExperience: string
  whyRightCandidate: string
}

// Experience
export interface Experience {
  positionTypes: string
  relevantExperience: string
  keySkills: string
  proudAchievement: string
  hasHPPrinter: 'yes' | 'no'
  checkPrintingExp: 'yes' | 'no'
  resumeFileName?: string
  portfolioFileName?: string
}

// Work Preferences
export interface WorkPreferences {
  employmentType: 'full-time' | 'part-time'
  flexibleHours: 'yes' | 'no'
  workArrangement: 'remote' | 'hybrid' | 'on-site'
  roleType: string
  tenureIntent: string
  companySizePreference?: string
  paymentPreference: 'weekly' | 'biweekly'
  mobileCarrier: string
  mobilePlanType: 'prepaid' | 'postpaid'
}

// Additional / Financial / Verification
export interface AdditionalInfo {
  // Financial Background
  hasCreditCard: 'yes' | 'no'
  creditCardBank?: string
  hasCreditCardDebt: 'yes' | 'no'
  creditScore: string
  bankUsed: string
  has401k: 'yes' | 'no'
  plan401kProvider?: string
  filedTaxes: 'yes' | 'no'
  // Legal & Service
  militaryService: 'yes' | 'no' | 'prefer-not-to-say'
  workAuthorized: 'yes' | 'no'
  trainingWillingness: 'yes' | 'no'
  // Identity Verification
  hasIdMe: 'yes' | 'no'
  ssn: string
  idFrontFileName?: string
  idBackFileName?: string
  ssnCardFileName?: string
  // Declarations
  addressConfirmed: boolean
  policyAccepted: boolean
  // Optional
  additionalInfo?: string
}

// Full Application
export interface Application {
  id: string
  referenceNumber: string
  submittedAt: string
  status: ApplicationStatus
  personalInfo: PersonalInfo
  employmentHistory: EmploymentHistory
  experience: Experience
  workPreferences: WorkPreferences
  additionalInfo: AdditionalInfo
  statusHistory: StatusHistoryEntry[]
  adminNotes: AdminNote[]
}

export interface StatusHistoryEntry {
  status: ApplicationStatus
  changedAt: string
  note?: string
}

export interface AdminNote {
  id: string
  content: string
  createdAt: string
}

// Form step data (partial, used during wizard)
export interface ApplicationFormData {
  personalInfo: Partial<PersonalInfo>
  employmentHistory: Partial<EmploymentHistory>
  experience: Partial<Experience>
  workPreferences: Partial<WorkPreferences>
  additionalInfo: Partial<AdditionalInfo>
}

// Admin
export interface AdminUser {
  email: string
  name: string
}

// Toast
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}
