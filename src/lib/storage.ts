import type {
  Application,
  ApplicationListItem,
  ApplicationStatus,
  AdminNote,
  StatusHistoryEntry,
} from "./types";
import { supabase } from "./supabase";

export interface ApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  closed: number;
}

// Map DB row to full Application object
function mapRowToApplication(
  row: any,
  history: StatusHistoryEntry[] = [],
  notes: AdminNote[] = []
): Application {
  return {
    id: row.id,
    referenceNumber: row.reference_number,
    submittedAt: row.submitted_at,
    status: row.status as ApplicationStatus,
    personalInfo: {
      firstName: row.first_name || "",
      lastName: row.last_name || "",
      dateOfBirth: row.date_of_birth || "",
      gender: row.gender || undefined,
      maritalStatus: row.marital_status || "",
      selfIntroduction: row.self_introduction || "",
      email: row.email || "",
      phone: row.phone || "",
      address: row.address || "",
      city: row.city || "",
      state: row.state || "",
      zipCode: row.zip_code || "",
      country: row.country || "",
      socialHandle: row.social_handle || "no",
      linkedin: row.linkedin || undefined,
      portfolio: row.portfolio || undefined,
    },
    employmentHistory: {
      currentlyEmployed: row.currently_employed || "no",
      howObtained: row.how_obtained || "",
      previousTitles: row.previous_titles || "",
      previousEmployers: row.previous_employers || "",
      responsibilities: row.responsibilities || "",
      yearsExperience: row.years_experience || "",
      whyRightCandidate: row.why_right_candidate || "",
    },
    experience: {
      positionTypes: row.position_types || "",
      relevantExperience: row.relevant_experience || "",
      keySkills: row.key_skills || "",
      proudAchievement: row.proud_achievement || "",
      hasHPPrinter: row.has_hp_printer || "no",
      checkPrintingExp: row.check_printing_exp || "no",
      resumeFileName: row.resume_file_name || undefined,
      portfolioFileName: row.portfolio_file_name || undefined,
    },
    workPreferences: {
      employmentType: row.employment_type || "full-time",
      flexibleHours: row.flexible_hours || "yes",
      workArrangement: row.work_arrangement || "remote",
      roleType: row.role_type || "",
      tenureIntent: row.tenure_intent || "",
      companySizePreference: row.company_size_preference || undefined,
      paymentPreference: row.payment_preference || "biweekly",
      mobileCarrier: row.mobile_carrier || "",
      mobilePlanType: row.mobile_plan_type || "postpaid",
    },
    additionalInfo: {
      hasCreditCard: row.has_credit_card || "no",
      creditCardBank: row.credit_card_bank || undefined,
      hasCreditCardDebt: row.has_credit_card_debt || "no",
      creditScore: row.credit_score || "",
      bankUsed: row.bank_used || "",
      has401k: row.has_401k || "no",
      plan401kProvider: row.plan_401k_provider || undefined,
      filedTaxes: row.filed_taxes || "yes",
      militaryService: row.military_service || "no",
      workAuthorized: row.work_authorized || "yes",
      trainingWillingness: row.training_willingness || "yes",
      hasIdMe: row.has_id_me || "no",
      ssn: row.ssn || "",
      idFrontFileName: row.id_front_file_name || undefined,
      idBackFileName: row.id_back_file_name || undefined,
      ssnCardFileName: row.ssn_card_file_name || undefined,
      addressConfirmed: Boolean(row.address_confirmed),
      policyAccepted: Boolean(row.policy_accepted),
      additionalInfo: row.additional_info || undefined,
    },
    statusHistory: history,
    adminNotes: notes,
  };
}

// Map Application object to DB row
function mapApplicationToRow(app: Application) {
  const pi = app.personalInfo;
  const eh = app.employmentHistory;
  const ex = app.experience;
  const wp = app.workPreferences;
  const ai = app.additionalInfo;

  return {
    id: app.id,
    reference_number: app.referenceNumber,
    submitted_at: app.submittedAt,
    status: app.status,
    first_name: pi.firstName,
    last_name: pi.lastName,
    date_of_birth: pi.dateOfBirth,
    gender: pi.gender || null,
    marital_status: pi.maritalStatus,
    self_introduction: pi.selfIntroduction,
    email: pi.email,
    phone: pi.phone,
    address: pi.address,
    city: pi.city,
    state: pi.state,
    zip_code: pi.zipCode,
    country: pi.country,
    social_handle: pi.socialHandle,
    linkedin: pi.linkedin || null,
    portfolio: pi.portfolio || null,
    currently_employed: eh.currentlyEmployed,
    how_obtained: eh.howObtained,
    previous_titles: eh.previousTitles,
    previous_employers: eh.previousEmployers,
    responsibilities: eh.responsibilities,
    years_experience: eh.yearsExperience,
    why_right_candidate: eh.whyRightCandidate,
    position_types: ex.positionTypes,
    relevant_experience: ex.relevantExperience,
    key_skills: ex.keySkills,
    proud_achievement: ex.proudAchievement,
    has_hp_printer: ex.hasHPPrinter,
    check_printing_exp: ex.checkPrintingExp,
    resume_file_name: ex.resumeFileName || null,
    portfolio_file_name: ex.portfolioFileName || null,
    employment_type: wp.employmentType,
    flexible_hours: wp.flexibleHours,
    work_arrangement: wp.workArrangement,
    role_type: wp.roleType,
    tenure_intent: wp.tenureIntent,
    company_size_preference: wp.companySizePreference || null,
    payment_preference: wp.paymentPreference,
    mobile_carrier: wp.mobileCarrier,
    mobile_plan_type: wp.mobilePlanType,
    has_credit_card: ai.hasCreditCard,
    credit_card_bank: ai.creditCardBank || null,
    has_credit_card_debt: ai.hasCreditCardDebt,
    credit_score: ai.creditScore,
    bank_used: ai.bankUsed,
    has_401k: ai.has401k,
    plan_401k_provider: ai.plan401kProvider || null,
    filed_taxes: ai.filedTaxes,
    military_service: ai.militaryService,
    work_authorized: ai.workAuthorized,
    training_willingness: ai.trainingWillingness,
    has_id_me: ai.hasIdMe,
    ssn: ai.ssn,
    id_front_file_name: ai.idFrontFileName || null,
    id_back_file_name: ai.idBackFileName || null,
    ssn_card_file_name: ai.ssnCardFileName || null,
    address_confirmed: ai.addressConfirmed,
    policy_accepted: ai.policyAccepted,
    additional_info: ai.additionalInfo || null,
  };
}

/**
 * 1. Lightweight Query for Applications List / Table.
 * Fetches only the basic fields needed for the table display.
 */
export async function fetchApplicationsList(): Promise<ApplicationListItem[]> {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("id, reference_number, submitted_at, status, first_name, last_name, email")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch applications list error:", error.message);
      throw new Error(error.message);
    }

    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      referenceNumber: row.reference_number,
      submittedAt: row.submitted_at,
      status: row.status as ApplicationStatus,
      firstName: row.first_name || "",
      lastName: row.last_name || "",
      email: row.email || "",
    }));
  } catch (err: any) {
    console.error("Failed to fetch applications list:", err);
    throw new Error(err?.message || "Failed to load applications list.");
  }
}

// Backward-compatible alias
export const fetchApplications = fetchApplicationsList;
export const fetchApplicationsFromSupabase = fetchApplicationsList;

/**
 * 2. Dedicated Query for Single Application Detail.
 * Fetches the specific application's full questionnaire, documents, timeline history, and notes.
 */
export async function fetchApplicationDetail(
  id: string
): Promise<Application | null> {
  try {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    let query = supabase.from("applications").select("*");
    if (isUUID) {
      query = query.eq("id", id);
    } else {
      query = query.eq("reference_number", id);
    }

    const { data: appRow, error: appError } = await query.maybeSingle();

    if (appError) {
      console.error("Supabase fetch application detail error:", appError.message);
      throw new Error(appError.message);
    }

    if (!appRow) {
      return null;
    }

    // Fetch status history for this single app
    const { data: shData } = await supabase
      .from("status_history")
      .select("*")
      .eq("application_id", appRow.id)
      .order("changed_at", { ascending: true });

    // Fetch admin notes for this single app
    const { data: anData } = await supabase
      .from("admin_notes")
      .select("*")
      .eq("application_id", appRow.id)
      .order("created_at", { ascending: true });

    const history: StatusHistoryEntry[] = (shData || []).map((sh) => ({
      status: sh.status as ApplicationStatus,
      changedAt: sh.changed_at,
      note: sh.note || undefined,
    }));

    const notes: AdminNote[] = (anData || []).map((an) => ({
      id: an.id,
      content: an.content,
      createdAt: an.created_at,
    }));

    return mapRowToApplication(appRow, history, notes);
  } catch (err: any) {
    console.error("Failed to fetch application detail:", err);
    throw err;
  }
}

// Backward-compatible alias
export const fetchApplicationById = fetchApplicationDetail;

/**
 * Save a new application directly to Supabase DB.
 */
export async function saveApplication(app: Application): Promise<void> {
  try {
    const dbRow = mapApplicationToRow(app);
    const { error: upsertError } = await supabase
      .from("applications")
      .upsert(dbRow);

    if (upsertError) {
      console.error("Supabase application upsert error:", upsertError.message);
      throw new Error(upsertError.message);
    }

    // Save initial status history entry
    if (app.statusHistory.length > 0) {
      const initialEntry = app.statusHistory[0];
      const { error: shError } = await supabase.from("status_history").insert({
        application_id: app.id,
        status: initialEntry.status,
        changed_at: initialEntry.changedAt,
        note: initialEntry.note || null,
      });

      if (shError) {
        console.warn("Supabase initial status history insert warning:", shError.message);
      }
    }
  } catch (err: any) {
    console.error("Supabase save application exception:", err);
    throw err;
  }
}

// Backward-compatible alias
export const saveApplicationAsync = saveApplication;

/**
 * Update an application status in Supabase DB and insert an audit trail entry.
 */
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  note?: string
): Promise<Application> {
  const changedAt = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (updateError) {
    console.error("Supabase update status error:", updateError.message);
    throw new Error(updateError.message);
  }

  const { error: historyError } = await supabase.from("status_history").insert({
    application_id: id,
    status,
    changed_at: changedAt,
    note: note || null,
  });

  if (historyError) {
    console.warn("Supabase status history insert warning:", historyError.message);
  }

  const updatedApp = await fetchApplicationDetail(id);
  if (!updatedApp) {
    throw new Error("Failed to reload updated application.");
  }

  return updatedApp;
}

// Backward-compatible alias
export const updateApplicationStatusAsync = updateApplicationStatus;

/**
 * Add an internal admin note in Supabase DB.
 */
export async function addAdminNote(
  id: string,
  content: string
): Promise<AdminNote> {
  const noteId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const { error } = await supabase.from("admin_notes").insert({
    id: noteId,
    application_id: id,
    content,
    created_at: createdAt,
  });

  if (error) {
    console.error("Supabase add note error:", error.message);
    throw new Error(error.message);
  }

  return {
    id: noteId,
    content,
    createdAt,
  };
}

// Backward-compatible alias
export const addAdminNoteAsync = addAdminNote;

/**
 * Calculate application stats from application list.
 */
export function calculateStats(apps: ApplicationListItem[] | Application[]): ApplicationStats {
  return {
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    underReview: apps.filter((a) => a.status === "under_review").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
    closed: apps.filter((a) => a.status === "closed").length,
  };
}
