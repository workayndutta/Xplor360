import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <span className="text-2xl font-bold text-brand-600">Xplor360</span>
        <div className="flex gap-4">
          <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Plan your trip.
          <br />
          <span className="text-brand-500">Capture your story.</span>
          <br />
          Publish everywhere.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          India's first AI-powered platform that plans your entire journey, guides your content
          creation on-trip, and publishes polished Reels and blogs — automatically.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-brand-500 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-brand-600 transition"
        >
          Plan your next trip →
        </Link>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: "🗺️",
            title: "SmartTrip",
            desc: "AI itinerary builder. Unified train, flight, bus & hotel booking. Expedition mode for Ladakh, Char Dham, Himalayan treks.",
          },
          {
            icon: "🎬",
            title: "ContentPilot",
            desc: "Tap record, talk naturally. Get a polished blog post, Instagram Reel, and captions — before your chai goes cold.",
          },
          {
            icon: "📊",
            title: "SocialLaunch",
            desc: "One approval publishes to Instagram, YouTube, and Snapchat at optimal times. Weekly creator performance report in your inbox.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
