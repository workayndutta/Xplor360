import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xplor360 — India's AI Travel & Content Platform",
  description:
    "Plan your trip, capture your journey, and publish polished content — all in one AI-powered platform built for Indian travelers.",
  keywords: ["travel planner India", "AI itinerary", "travel vlog app", "India trip planner"],
  openGraph: {
    title: "Xplor360",
    description: "India's AI-powered travel and content creation platform.",
    url: "https://xplor360.in",
    siteName: "Xplor360",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0c0e14] text-white antialiased">{children}</body>
    </html>
  );
}
