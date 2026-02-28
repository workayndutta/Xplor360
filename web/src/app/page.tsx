import Link from "next/link";
import {
  Compass,
  MapPin,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Globe,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0e14] text-white overflow-x-hidden">

      {/* ── Aurora background orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="float-orb absolute top-[-15%] left-[-8%] w-[640px] h-[640px] bg-orange-500/10 rounded-full blur-[140px]" />
        <div className="float-orb-2 absolute top-[45%] right-[-12%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="float-orb-3 absolute bottom-[-5%] left-[35%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0c0e14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Compass size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Xplor360</span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-sm text-white/60 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium transition-all duration-200 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:scale-[1.02]"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
        {/* Season badge with live dot */}
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-10">
          <span className="live-dot w-1.5 h-1.5 bg-orange-400 rounded-full" />
          Late February · Rajasthan &amp; Goa are calling
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.07] tracking-tight mb-6">
          Plan smarter.{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">Travel better.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
          Your AI travel companion that understands you — personalized
          itineraries, smart accommodation picks, and season-aware suggestions.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
          <Link
            href="/smarttrip?mode=guest"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-8 py-4 rounded-2xl transition-all duration-200 cta-glow hover:scale-[1.02]"
          >
            <MapPin size={18} />
            Continue as Guest
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>

          <Link
            href="/auth/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-white text-base font-medium px-8 py-4 rounded-2xl border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all duration-200"
          >
            Sign in / Create account
          </Link>
        </div>

        <p className="text-white/25 text-xs mb-14">
          No account needed · Full features unlock after sign-up
        </p>

        {/* Stats strip */}
        <div className="flex items-center justify-center gap-10 pt-10 border-t border-white/5">
          {[
            { value: "10K+", label: "Trips planned" },
            { value: "50+",  label: "Destinations" },
            { value: "4.9★", label: "User rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-xs text-white/35 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bento Grid ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

          {/* ── Big card: SmartTrip with mock chat preview ── */}
          <div className="md:col-span-4 relative rounded-3xl border border-white/8 glass overflow-hidden p-8 bento-card gradient-border">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-white font-bold text-xl">SmartTrip</h2>
                    <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>
                  <p className="text-white/40 text-xs">AI Itinerary &amp; Travel Planner</p>
                </div>
              </div>

              {/* Mock chat preview */}
              <div className="bg-black/25 rounded-2xl p-4 mb-6 space-y-3 border border-white/5">
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={11} className="text-orange-400" />
                  </div>
                  <div className="bg-white/6 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-white/70 max-w-[76%] leading-relaxed">
                    Where would you like to explore? 🌍
                  </div>
                </div>
                <div className="flex gap-2.5 justify-end">
                  <div className="bg-orange-500/15 border border-orange-500/20 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs text-orange-200 max-w-[76%] leading-relaxed">
                    Goa, 4 days — beach + culture mix ✨
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={11} className="text-orange-400" />
                  </div>
                  <div className="bg-white/6 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-white/70 max-w-[76%] leading-relaxed">
                    Perfect! Here&apos;s your 4-day Goa itinerary — beach mornings,
                    cultural afternoons, and vibrant evenings 🏖️
                  </div>
                </div>
              </div>

              <Link
                href="/smarttrip?mode=guest"
                className="inline-flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors font-semibold"
              >
                Try SmartTrip now <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── Right column: 2 small stacked cards ── */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex-1 relative rounded-3xl border border-white/8 glass overflow-hidden p-6 bento-card">
              <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="w-9 h-9 bg-amber-500/15 rounded-xl flex items-center justify-center mb-4">
                <Star size={16} className="text-amber-400" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Season-Smart</h3>
              <p className="text-white/40 text-xs leading-relaxed">
                Real-time picks based on today&apos;s weather and travel season.
              </p>
            </div>

            <div className="flex-1 relative rounded-3xl border border-white/8 glass overflow-hidden p-6 bento-card">
              <div className="absolute -top-8 -left-8 w-28 h-28 bg-green-500/8 rounded-full blur-2xl pointer-events-none" />
              <div className="w-9 h-9 bg-green-500/15 rounded-xl flex items-center justify-center mb-4">
                <Shield size={16} className="text-green-400" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">End-to-End</h3>
              <p className="text-white/40 text-xs leading-relaxed">
                Itinerary → Hotels → Booking. All in one guided flow.
              </p>
            </div>
          </div>

          {/* ── Bottom row: 3 equal cards ── */}
          <div className="md:col-span-2 relative rounded-3xl border border-white/8 glass overflow-hidden p-6 bento-card">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-500/8 rounded-full blur-2xl pointer-events-none" />
            <div className="w-9 h-9 bg-orange-500/15 rounded-xl flex items-center justify-center mb-4">
              <Zap size={16} className="text-orange-400" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">Persona-Aware</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              Trips built around your personality and travel style.
            </p>
          </div>

          <div className="md:col-span-2 relative rounded-3xl border border-white/8 glass overflow-hidden p-6 bento-card">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-500/8 rounded-full blur-2xl pointer-events-none" />
            <div className="w-9 h-9 bg-sky-500/15 rounded-xl flex items-center justify-center mb-4">
              <Globe size={16} className="text-sky-400" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">50+ Destinations</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              Curated places across India, updated every season.
            </p>
          </div>

          <div className="md:col-span-2 relative rounded-3xl border border-white/8 glass overflow-hidden p-6 bento-card">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-violet-500/8 rounded-full blur-2xl pointer-events-none" />
            <div className="w-9 h-9 bg-violet-500/15 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={16} className="text-violet-400" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">Smart Budget</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              Day-by-day cost estimates matching your budget tier.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-white/25 text-xs">
        © 2026 Xplor360 · India&apos;s AI Travel Platform
      </footer>
    </div>
  );
}
