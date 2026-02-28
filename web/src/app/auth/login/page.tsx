"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate Supabase auth
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0c0e14] flex">
      {/* ── Left panel (decorative) ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-r border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Compass size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">Xplor360</span>
        </Link>

        <div>
          <blockquote className="text-white/70 text-xl leading-relaxed mb-6">
            &ldquo;Every journey begins with a single step — let AI plan the rest.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-white text-sm font-medium">AI Travel Companion</p>
              <p className="text-white/40 text-xs">Xplor360 SmartTrip</p>
            </div>
          </div>
        </div>

        <p className="text-white/20 text-xs">© 2026 Xplor360</p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <Compass size={16} className="text-white" />
            </div>
            <span className="text-white font-bold">Xplor360</span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">
            Sign in to access your trips and saved itineraries
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-white/50 font-medium">Password</label>
                <Link href="#" className="text-xs text-orange-400 hover:text-orange-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all mt-2"
            >
              {loading ? (
                <span className="flex gap-1">
                  <span className="typing-dot w-1.5 h-1.5 bg-white rounded-full inline-block" />
                  <span className="typing-dot w-1.5 h-1.5 bg-white rounded-full inline-block" />
                  <span className="typing-dot w-1.5 h-1.5 bg-white rounded-full inline-block" />
                </span>
              ) : (
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/25 text-xs">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Guest option */}
          <Link
            href="/smarttrip?mode=guest"
            className="w-full flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium py-3.5 rounded-xl transition-all"
          >
            Continue as Guest
          </Link>

          <p className="text-center text-white/35 text-xs mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300 font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
