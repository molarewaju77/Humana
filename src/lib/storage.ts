import type {
  Application,
  ApplicationStatus,
  AdminNote,
  StatusHistoryEntry,
} from "./types";
import { supabase } from "./supabase";

const APPLICATIONS_KEY = "hamana_applications";

// Map DB row to Application object
function mapRowToApplication(
  row: any,
  history: StatusHistoryEntry[] = [],
  notes: AdminNote[] = [],
): Application {
  return {
    id: row.id,
    referenceNumber: row.reference_number,
    submittedAt: row.submitted_at,
    status: row.status as ApplicationStatus,
    personalInfo: {
      firstName: row.first_name,
      lastName: row.last_name,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      maritalStatus: row.marital_status,
      selfIntroduction: row.self_introduction,
      email: row.email,
      phone: row.phone,
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      country: row.country,
      socialHandle: row.social_handle || "no",
      linkedin: row.linkedin,
      portfolio: row.portfolio,
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
      resumeFileName: row.resume_file_name,
      portfolioFileName: row.portfolio_file_name,
    },
    workPreferences: {
      employmentType: row.employment_type || "full-time",
      flexibleHours: row.flexible_hours || "yes",
      workArrangement: row.work_arrangement || "remote",
      roleType: row.role_type || "",
      tenureIntent: row.tenure_intent || "",
      companySizePreference: row.company_size_preference,
      paymentPreference: row.payment_preference || "biweekly",
      mobileCarrier: row.mobile_carrier || "",
      mobilePlanType: row.mobile_plan_type || "postpaid",
    },
    additionalInfo: {
      hasCreditCard: row.has_credit_card || "no",
      creditCardBank: row.credit_card_bank,
      hasCreditCardDebt: row.has_credit_card_debt || "no",
      creditScore: row.credit_score || "",
      bankUsed: row.bank_used || "",
      has401k: row.has_401k || "no",
      plan401kProvider: row.plan_401k_provider,
      filedTaxes: row.filed_taxes || "yes",
      militaryService: row.military_service || "no",
      workAuthorized: row.work_authorized || "yes",
      trainingWillingness: row.training_willingness || "yes",
      hasIdMe: row.has_id_me || "no",
      ssn: row.ssn || "",
      idFrontFileName: row.id_front_file_name,
      idBackFileName: row.id_back_file_name,
      ssnCardFileName: row.ssn_card_file_name,
      addressConfirmed: Boolean(row.address_confirmed),
      policyAccepted: Boolean(row.policy_accepted),
      additionalInfo: row.additional_info,
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

// Sync from Supabase DB
export async function fetchApplicationsFromSupabase(): Promise<Application[]> {
  try {
    const { data: appRows, error: appError } = await supabase
      .from("applications")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (appError) {
      console.error("Supabase fetch applications error:", appError.message);
      throw new Error(appError.message);
    }

    if (!appRows) {
      return [];
    }

    const appIds = appRows.map((r) => r.id);

    // Fetch status history
    let statusHistoryRows: any[] = [];
    if (appIds.length > 0) {
      const { data: shData } = await supabase
        .from("status_history")
        .select("*")
        .in("application_id", appIds)
        .order("changed_at", { ascending: true });
      if (shData) statusHistoryRows = shData;
    }

    // Fetch admin notes
    let adminNotesRows: any[] = [];
    if (appIds.length > 0) {
      const { data: anData } = await supabase
        .from("admin_notes")
        .select("*")
        .in("application_id", appIds)
        .order("created_at", { ascending: true });
      if (anData) adminNotesRows = anData;
    }

    const apps = appRows.map((row) => {
      const history: StatusHistoryEntry[] = statusHistoryRows
        .filter((sh) => sh.application_id === row.id)
        .map((sh) => ({
          status: sh.status as ApplicationStatus,
          changedAt: sh.changed_at,
          note: sh.note,
        }));

      const notes: AdminNote[] = adminNotesRows
        .filter((an) => an.application_id === row.id)
        .map((an) => ({
          id: an.id,
          content: an.content,
          createdAt: an.created_at,
        }));

      return mapRowToApplication(row, history, notes);
    });

    // Cache locally
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    return apps;
  } catch (err: any) {
    console.error("Failed to fetch from Supabase:", err);
    throw new Error(
      err?.message || "Failed to load applications from Supabase.",
    );
  }
}

// Local cache getter
function getApplicationsLocal(): Application[] {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as Application[];
  } catch {
    return [];
  }
}

export function getApplications(): Application[] {
  return getApplicationsLocal();
}

export function getApplicationById(id: string): Application | undefined {
  return getApplicationsLocal().find((app) => app.id === id);
}

// Async save application to Supabase & localStorage
export async function saveApplicationAsync(app: Application): Promise<void> {
  // Update local storage immediately
  const apps = getApplicationsLocal();
  const existingIndex = apps.findIndex((a) => a.id === app.id);
  if (existingIndex >= 0) {
    apps[existingIndex] = app;
  } else {
    apps.unshift(app);
  }
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));

  // Persist to Supabase
  try {
    const dbRow = mapApplicationToRow(app);
    const { error: upsertError } = await supabase
      .from("applications")
      .upsert(dbRow);
    if (upsertError) {
      console.error("Supabase application upsert error:", upsertError.message);
    }

    // Save initial status history entry
    if (app.statusHistory.length > 0) {
      const initialEntry = app.statusHistory[0];
      await supabase.from("status_history").insert({
        application_id: app.id,
        status: initialEntry.status,
        changed_at: initialEntry.changedAt,
        note: initialEntry.note || null,
      });
    }
  } catch (err) {
    console.error("Supabase save exception:", err);
  }
}

export function saveApplication(app: Application): void {
  saveApplicationAsync(app);
}

// Async update status in Supabase & localStorage
export async function updateApplicationStatusAsync(
  id: string,
  status: ApplicationStatus,
  note?: string,
): Promise<Application | undefined> {
  const apps = getApplicationsLocal();
  const index = apps.findIndex((a) => a.id === id);
  if (index < 0) return undefined;

  const changedAt = new Date().toISOString();
  const entry: StatusHistoryEntry = { status, changedAt, note };

  apps[index] = {
    ...apps[index],
    status,
    statusHistory: [...apps[index].statusHistory, entry],
  };
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));

  try {
    await supabase.from("applications").update({ status }).eq("id", id);
    await supabase.from("status_history").insert({
      application_id: id,
      status,
      changed_at: changedAt,
      note: note || null,
    });
  } catch (err) {
    console.error("Supabase update status error:", err);
  }

  return apps[index];
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  note?: string,
): Application | undefined {
  updateApplicationStatusAsync(id, status, note);
  const apps = getApplicationsLocal();
  return apps.find((a) => a.id === id);
}

// Async add admin note in Supabase & localStorage
export async function addAdminNoteAsync(
  id: string,
  content: string,
): Promise<Application | undefined> {
  const apps = getApplicationsLocal();
  const index = apps.findIndex((a) => a.id === id);
  if (index < 0) return undefined;

  const noteId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const note: AdminNote = {
    id: noteId,
    content,
    createdAt,
  };

  apps[index] = {
    ...apps[index],
    adminNotes: [...apps[index].adminNotes, note],
  };
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));

  try {
    await supabase.from("admin_notes").insert({
      id: noteId,
      application_id: id,
      content,
      created_at: createdAt,
    });
  } catch (err) {
    console.error("Supabase add note error:", err);
  }

  return apps[index];
}

export function addAdminNote(
  id: string,
  content: string,
): Application | undefined {
  addAdminNoteAsync(id, content);
  const apps = getApplicationsLocal();
  return apps.find((a) => a.id === id);
}

export function getApplicationStats() {
  const apps = getApplicationsLocal();
  return {
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    underReview: apps.filter((a) => a.status === "under_review").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
    closed: apps.filter((a) => a.status === "closed").length,
  };
}
