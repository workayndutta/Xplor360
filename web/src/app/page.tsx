import Link from "next/link";
import { Compass, MapPin, Zap, Shield, ArrowRight, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0e14] text-white overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0c0e14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Compass className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">Xplor360</span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-sm text-white/60 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md shadow-orange-500/20"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Season badge */}
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-medium px-4 py-1.5 rounded-full mb-10">
          <Star size={12} />
          Late February · Rajasthan &amp; Goa are calling
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.07] tracking-tight mb-6">
          Plan smarter.{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">Travel better.</span>
        </h1>
        <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
          Your AI travel companion that understands you — personalized
          itineraries, smart accommodation picks, and season-aware suggestions.
        </p>

        {/* ── Primary CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/smarttrip?mode=guest"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-orange-500/25 hover:scale-[1.02]"
          >
            <MapPin size={18} />
            Continue as Guest
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/auth/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-white text-base font-medium px-8 py-4 rounded-2xl border border-white/15 hover:bg-white/5 transition-all"
          >
            Sign in / Create account
          </Link>
        </div>

        <p className="text-white/30 text-xs mt-4">
          No account needed · Full features unlock after sign-up
        </p>
      </section>

      {/* ── SmartTrip Feature Card ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="relative rounded-3xl border border-white/8 glass overflow-hidden p-8 md:p-12">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <MapPin size={22} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-white font-bold text-2xl">SmartTrip</h2>
                    <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>
                  <p className="text-white/40 text-sm">AI Itinerary &amp; Travel Planner</p>
                </div>
              </div>

              <Link
                href="/smarttrip?mode=guest"
                className="hidden md:flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                Try now <ArrowRight size={14} />
              </Link>
            </div>

            {/* Feature pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                {
                  icon: Zap,
                  title: "Persona-Aware",
                  desc: "Tell us your travel style. We craft trips built around your personality.",
                },
                {
                  icon: Star,
                  title: "Season-Smart",
                  desc: "Real-time destination picks based on today's weather and season.",
                },
                {
                  icon: Shield,
                  title: "End-to-End",
                  desc: "Itinerary → Accommodation → Booking. All in one guided chat.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white/4 border border-white/8 rounded-2xl p-5"
                >
                  <div className="w-8 h-8 bg-orange-500/15 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={16} className="text-orange-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="border-t border-white/8 pt-8">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-4">How it works</p>
              <div className="flex flex-col md:flex-row gap-3">
                {[
                  "Chat tells us your travel style",
                  "AI picks the best destinations for this season",
                  "Day-by-day itinerary is generated",
                  "Smart accommodation options",
                  "Book & save your trip",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-white/50 text-xs">{step}</span>
                    {i < 4 && (
                      <ArrowRight size={12} className="text-white/20 hidden md:block flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 text-center text-white/25 text-xs">
        © 2026 Xplor360 · India&apos;s AI Travel Platform
      </footer>
    </div>
  );
}
