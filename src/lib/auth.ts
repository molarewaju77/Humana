import { supabase } from "./supabase";

const AUTH_KEY = "hamana_admin_session";

// Automatically sync Supabase auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    const sessionData = {
      email: session.user.email || "",
      name:
        session.user.user_metadata?.full_name ||
        session.user.email?.split("@")[0] ||
        "Admin User",
    };
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
  } else if (event === "SIGNED_OUT") {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  }
});

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const sessionData = {
        email: data.user.email || email,
        name:
          data.user.user_metadata?.full_name ||
          email.split("@")[0] ||
          "Admin User",
      };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Authentication failed" };
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  } finally {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getAdminSession(): { email: string; name: string } | null {
  try {
    const raw =
      sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}
