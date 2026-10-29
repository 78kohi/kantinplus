import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Award, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function RewardPoints() {
  const { user, loading } = useAuth();
  const [points, setPoints] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setFetching(false);
      return;
    }

    let active = true;

    async function fetchPoints() {
      setFetching(true);
      setError("");

      const { data, error } = await supabase
        .from("profiles")
        .select("reward_points")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Failed to load reward points:", error);
        setError("Poin belum bisa dimuat.");
      } else {
        setPoints(data?.reward_points ?? 0);
      }

      setFetching(false);
    }

    fetchPoints();

    return () => {
      active = false;
    };
  }, [user, loading]);

  if (loading) return null;

  if (!user) {
    return (
      <section className="rounded-3xl bg-[#19334b] p-6 text-white">
        <Award size={28} />
        <h2 className="mt-4 text-xl font-extrabold">KantinPlus Rewards</h2>
        <p className="mt-2 text-sm text-white/70">
          Masuk untuk mengumpulkan poin setiap kali pesananmu dibayar.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#19334b]"
        >
          Masuk sekarang <ArrowRight size={16} />
        </Link>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#19334b] p-6 text-white sm:p-7">
      <div className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-sky-300/10" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-200">
            <Award size={20} />
            KantinPlus Rewards
          </div>

          <p className="mt-5 text-sm text-white/70">Total poin kamu</p>

          <p className="mt-1 text-4xl font-black tracking-tight">
            {fetching ? "..." : points.toLocaleString("id-ID")}
            <span className="ml-2 text-base font-bold text-sky-200">poin</span>
          </p>

          <p className="mt-3 text-xs leading-5 text-white/60">
            Dapatkan 1 poin untuk setiap pembayaran yang terkonfirmasi.
          </p>

          {error && <p className="mt-2 text-xs text-amber-200">{error}</p>}
        </div>

        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10">
          <Award size={26} className="text-sky-200" />
        </div>
      </div>
    </section>
  );
}
