import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (loading) return;

      if (!user) {
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }

      setCheckingRole(true);

      try {
        const { data, error } = await supabase.rpc("is_admin");

        if (error) throw error;

        if (active) {
          setIsAdmin(data === true);
        }
      } catch (error) {
        console.error("Admin check failed:", error);

        if (active) {
          setIsAdmin(false);
        }
      } finally {
        if (active) {
          setCheckingRole(false);
        }
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [user, loading]);

  if (loading || checkingRole) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-500">
        Checking permissions...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
