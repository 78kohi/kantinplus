import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import Logo from "../components/Logo";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import RewardPoints from "../components/RewardPoints";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        // 1. Get the authenticated user
        const { data, error: authError } = await supabase.auth.getUser();

        if (authError) throw authError;

        const currentUser = data.user;

        if (!currentUser) {
          navigate("/login", { replace: true });
          return;
        }

        // 2. Fetch username and admin status together
        const [profileResult, adminResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("display_name")
            .eq("id", currentUser.id)
            .maybeSingle(),

          supabase.rpc("is_admin"),
        ]);

        if (profileResult.error) throw profileResult.error;
        if (adminResult.error) throw adminResult.error;

        if (!active) return;

        setUser(currentUser);
        setUsername(profileResult.data?.display_name || "");
        setIsAdmin(adminResult.data === true);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load profile.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSignOut() {
    setError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/", { replace: true });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F8F3] p-8">
        <p className="text-slate-500">Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const name = user.user_metadata?.display_name || "KantinPlus Customer";

  return (
    <main className="min-h-screen bg-[#F7F8F3] px-5 py-6 sm:py-16">
      <div className="mx-auto max-w-xl">
        <Link to="/" className="font-bold text-xl text-[#5fa8d3]">
          <div className="flex items-center md:space-x-1">
            <div className="opacity-90 p-1 rounded-md text-white font-[Plus Jakarta Sans] text-xl font-bold">
              <Logo w={52} h={52} />
            </div>
            <div className="text-[#19334b] font-[Plus Jakarta Sans] text-2xl font-bold">
              Kantin<span className="text-[#a2d6f9]">plus</span>
            </div>
          </div>
        </Link>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to home
        </button>

        <section className="mt-8 rounded-3xl bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f3fc] text-[#19334b]">
              <span className="text-2xl font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">My profile</p>
                <h1 className="break-words text-2xl font-bold text-[#19334b]">
                  {name}
                </h1>
              </div>
              <div className="flex flex-col text-right">
                <p className="font-extrabold">{isAdmin ? "(Admin)" : ""}</p>
                <Link
                  className="flex items-center gap-2"
                  to="/admin"
                >
                  <p>Ke dasbor admin</p>
                  <ArrowRight size={20} className="shrink-0 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-sm text-slate-500">Full name</p>
              <p className="mt-1 font-medium text-[#19334b]">{name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email address</p>
              <p className="mt-1 break-all font-medium text-[#19334b]">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Account ID</p>
              <p className="mt-1 break-all text-xs text-slate-500">{user.id}</p>
            </div>
          </div>

          {/* Reward Points */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <RewardPoints />
          </div>

          <Link
            to="/riwayat-pesanan"
            className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-[#e4f3fc] text-[#19334b]">
                <Package size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#19334b]">Order History</h2>
                <p className="mt-1 text-sm text-slate-500">
                  View your previous purchases
                </p>
              </div>
            </div>

            <ArrowRight size={19} className="shrink-0 text-slate-400" />
          </Link>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleSignOut}
            className="mt-8 w-full rounded-xl border border-slate-200 py-3 font-bold text-[#19334b] transition hover:bg-slate-50"
          >
            Sign out
          </button>
        </section>
      </div>
    </main>
  );
}
