import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import Logo from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          navigate("/profile", { replace: true });
        } else {
          setMessage(
            "Account created! Check your email to confirm your account, then sign in.",
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        navigate("/profile", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8F3] px-5 py-12 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-10 shadow-sm">
        <Link to="/" className="font-bold text-[#5fa8d3] text-xl">
          <div className="flex items-center md:space-x-1">
            <div className="opacity-90 p-1 rounded-md text-white font-[Plus Jakarta Sans] text-xl font-bold">
              <Logo w={52} h={52} />
            </div>
            <div className="text-[#19334b] font-[Plus Jakarta Sans] text-2xl font-bold">
              Kantin<span className="text-[#a2d6f9]">plus</span>
            </div>
          </div>
        </Link>

        <h1 className="mt-8 font-bold text-3xl text-[#19334b]">
          {isSignup ? "Create account" : "Welcome back!"}
        </h1>

        <p className="mt-2 text-slate-500">
          {isSignup
            ? "Join KantinPlus and enjoy your bites."
            : "Login to your KantinPlus account."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isSignup && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#5fa8d3]"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#5fa8d3]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#5fa8d3]"
              placeholder="Your password"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-[#19334b] py-3 font-bold text-white transition hover:bg-[#5fa8d3] disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account?" : "New to KantinPlus?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup((prev) => !prev);
              setError("");
              setMessage("");
            }}
            className="font-bold text-[#5fa8d3]"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-slate-500 hover:text-[#5fa8d3]"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
