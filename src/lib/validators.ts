import { z } from 'zod'

// ─── Step 1: Personal Information ──────────────────────────────────────────
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  maritalStatus: z.string().min(1, 'Please select your marital status'),
  selfIntroduction: z
    .string()
    .min(20, 'Please provide at least 20 characters to introduce yourself'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s\+\-\(\)]{7,20}$/, 'Please enter a valid phone number'),
  address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State/Region is required').max(100),
  zipCode: z.string().min(1, 'Zip / Postal code is required'),
  country: z.string().min(1, 'Country is required').max(100),
  socialHandle: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  linkedin: z.string().url('Please enter a valid LinkedIn URL').or(z.literal('')).optional(),
  portfolio: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
})

// ─── Step 2: Employment History ────────────────────────────────────────────
export const employmentHistorySchema = z.object({
  currentlyEmployed: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  howObtained: z.string().min(1, 'Please describe how you obtained previous employment'),
  previousTitles: z.string().min(1, 'Please enter your previous job title(s)'),
  previousEmployers: z.string().min(1, 'Please enter your previous employer(s)'),
  responsibilities: z
    .string()
    .min(20, 'Please provide at least 20 characters describing your responsibilities'),
  yearsExperience: z.string().min(1, 'Please enter your years of experience'),
  whyRightCandidate: z
    .string()
    .min(20, 'Please tell us why you are the right candidate (at least 20 characters)'),
})

// ─── Step 3: Experience & Equipment ────────────────────────────────────────
export const experienceSchema = z.object({
  positionTypes: z.string().min(1, 'Please describe types of positions you have held'),
  relevantExperience: z
    .string()
    .min(20, 'Please describe your relevant experience (at least 20 characters)'),
  keySkills: z.string().min(1, 'Please enter your key skills'),
  proudAchievement: z.string().min(10, 'Please describe your achievement (at least 10 characters)'),
  hasHPPrinter: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  checkPrintingExp: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  resumeFileName: z.string().optional(),
  portfolioFileName: z.string().optional(),
})

// ─── Step 4: Work Preferences ──────────────────────────────────────────────
export const workPreferencesSchema = z.object({
  employmentType: z.enum(['full-time', 'part-time'], { message: 'Please select employment type' }),
  flexibleHours: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  workArrangement: z.enum(['remote', 'hybrid', 'on-site'], {
    message: 'Please select a work arrangement',
  }),
  roleType: z.string().min(1, 'Please describe the type of role you are seeking'),
  tenureIntent: z.string().min(1, 'Please describe how long you intend to remain in your next role'),
  companySizePreference: z.string().optional(),
  paymentPreference: z.enum(['weekly', 'biweekly'], {
    message: 'Please select your preferred payment frequency',
  }),
  mobileCarrier: z.string().min(1, 'Please enter your mobile phone carrier'),
  mobilePlanType: z.enum(['prepaid', 'postpaid'], {
    message: 'Please select your mobile plan type',
  }),
})

// ─── Step 5: Financial & Verification ──────────────────────────────────────
export const additionalInfoSchema = z.object({
  // Financial Background
  hasCreditCard: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  creditCardBank: z.string().optional(),
  hasCreditCardDebt: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  creditScore: z.string().min(1, 'Please enter your approximate credit score'),
  bankUsed: z.string().min(1, 'Please enter the name of your bank'),
  has401k: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  plan401kProvider: z.string().optional(),
  filedTaxes: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  // Legal & Service
  militaryService: z.enum(['yes', 'no', 'prefer-not-to-say'], {
    message: 'Please select an option',
  }),
  workAuthorized: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  trainingWillingness: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  // Identity Verification
  hasIdMe: z.enum(['yes', 'no'], { message: 'Please select an option' }),
  ssn: z.string().min(1, 'SSN is required'),
  idFrontFileName: z.string().optional(),
  idBackFileName: z.string().optional(),
  ssnCardFileName: z.string().optional(),
  // Declarations
  addressConfirmed: z
    .boolean()
    .refine((v) => v === true, 'Please confirm your address is correct'),
  policyAccepted: z
    .boolean()
    .refine((v) => v === true, 'Please accept the company policies to proceed'),
  // Optional notes
  additionalInfo: z.string().max(1000, 'Please keep this under 1000 characters').optional(),
})

// ─── Admin ─────────────────────────────────────────────────────────────────
export const adminLoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

// ─── Inferred types ─────────────────────────────────────────────────────────
export type PersonalInfoData = z.infer<typeof personalInfoSchema>
export type EmploymentHistoryData = z.infer<typeof employmentHistorySchema>
export type ExperienceData = z.infer<typeof experienceSchema>
export type WorkPreferencesData = z.infer<typeof workPreferencesSchema>
export type AdditionalInfoData = z.infer<typeof additionalInfoSchema>
export type AdminLoginData = z.infer<typeof adminLoginSchema>
