import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../lib/supabaseClient";
import {
  signIn as login,
  signUp as register,
  signOut as logout,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) {
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadUserData() {
      // Reset data when the user changes
      setUsername("");
      setIsAdmin(false);

      if (!user) {
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);

      try {
        const [profileResult, adminResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .maybeSingle(),

          supabase.rpc("is_admin"),
        ]);

        if (profileResult.error) throw profileResult.error;
        if (adminResult.error) throw adminResult.error;

        if (!active) return;

        setUsername(profileResult.data?.display_name ?? "");
        setIsAdmin(adminResult.data === true);
      } catch (error) {
        if (!active) return;

        console.error("Failed to load user data:", error.message);
        // Keep safe defaults if fetching fails
      } finally {
        if (active) setProfileLoading(false);
      }
    }

    loadUserData();

    return () => {
      active = false;
    };
  }, [user]);

  async function signUp(email, password, displayName) {
    return register(email, password, displayName);
  }

  async function signIn(email, password) {
    return login(email, password);
  }

  async function signOut() {
    await logout();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        username,
        isAdmin,
        loading,
        profileLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
