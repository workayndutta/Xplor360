/**
 * Explore Tab — SmartTrip entry point.
 * Dark hero header, AI CTA, category chips, and destination grid.
 */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const STYLE_META = {
  adventure:  { bg: "#172554", text: "#93c5fd", label: "Adventure" },
  cultural:   { bg: "#2e1065", text: "#d8b4fe", label: "Cultural" },
  leisure:    { bg: "#064e3b", text: "#6ee7b7", label: "Leisure" },
  pilgrimage: { bg: "#422006", text: "#fcd34d", label: "Pilgrimage" },
} as const;

type Style = keyof typeof STYLE_META;

const CATEGORIES = ["All", "Adventure", "Cultural", "Leisure", "Pilgrimage"];

const FEATURED_DESTINATIONS: {
  name: string;
  state: string;
  emoji: string;
  style: Style;
  temp: string;
  season: string;
}[] = [
  { name: "Spiti Valley", state: "Himachal Pradesh",     emoji: "🏔️", style: "adventure",  temp: "−5°C",  season: "Cold" },
  { name: "Varanasi",     state: "Uttar Pradesh",        emoji: "🪔", style: "cultural",   temp: "20°C",  season: "Ideal" },
  { name: "Coorg",        state: "Karnataka",            emoji: "☕", style: "leisure",    temp: "18°C",  season: "Perfect" },
  { name: "Char Dham",    state: "Uttarakhand",          emoji: "🛕", style: "pilgrimage", temp: "8°C",   season: "Good" },
  { name: "Andaman",      state: "Andaman & Nicobar",   emoji: "🏖️", style: "leisure",    temp: "29°C",  season: "Perfect" },
  { name: "Ladakh",       state: "UT of J&K",           emoji: "🏍️", style: "adventure",  temp: "−10°C", season: "Closed" },
];

const SEASON_BG: Record<string, string> = {
  Perfect: "#064e3b",
  Ideal:   "#172554",
  Great:   "#1e3a5f",
  Good:    "#422006",
  Cold:    "#1e3a5f",
  Closed:  "#3b1f1f",
};

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── Dark hero header ── */}
        <View style={styles.hero}>
          {/* Decorative orange blobs */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />

          {/* Season badge */}
          <View style={styles.seasonBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.seasonText}>Late Feb · Rajasthan &amp; Goa</Text>
          </View>

          <Text style={styles.greeting}>Namaste 👋</Text>
          <Text style={styles.heroSub}>Where do you want to go next?</Text>

          {/* AI CTA */}
          <TouchableOpacity
            onPress={() => router.push("/itinerary/new")}
            style={styles.aiCta}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.aiCtaTitle}>✨ Plan with AI</Text>
              <Text style={styles.aiCtaSub}>
                Tell me your destination — I&apos;ll handle the rest
              </Text>
            </View>
            <View style={styles.aiCtaArrow}>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Search bar ── */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search destinations, styles..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
        </View>

        {/* ── Category filter chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, i === 0 && styles.chipActive]}
            >
              <Text style={[styles.chipText, i === 0 && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Section header ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Popular right now</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Destinations grid ── */}
        <View style={styles.grid}>
          {FEATURED_DESTINATIONS.map((d) => {
            const meta = STYLE_META[d.style];
            const seasonBg = SEASON_BG[d.season] ?? "#1f2937";
            return (
              <TouchableOpacity key={d.name} style={styles.card} activeOpacity={0.78}>
                {/* Top row: emoji + season pill */}
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardEmoji}>{d.emoji}</Text>
                  <View style={[styles.seasonPill, { backgroundColor: seasonBg }]}>
                    <Text style={styles.seasonPillText}>{d.season}</Text>
                  </View>
                </View>

                <Text style={styles.cardName}>{d.name}</Text>
                <Text style={styles.cardState}>{d.state}</Text>

                {/* Bottom row: style badge + temp */}
                <View style={styles.cardBottom}>
                  <View style={[styles.styleBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.styleBadgeText, { color: meta.text }]}>
                      {meta.label}
                    </Text>
                  </View>
                  <Text style={styles.temp}>{d.temp}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  // Hero
  hero: {
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    overflow: "hidden",
    position: "relative",
  },
  blob1: {
    position: "absolute",
    top: -60, right: -40,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: "#f97316", opacity: 0.07,
  },
  blob2: {
    position: "absolute",
    bottom: -50, left: -30,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "#f97316", opacity: 0.04,
  },
  seasonBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(249,115,22,0.12)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.25)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  liveDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: "#f97316",
  },
  seasonText: { fontSize: 11, color: "#fb923c", fontWeight: "600" },
  greeting: { fontSize: 28, fontWeight: "800", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 15, color: "#9ca3af", marginBottom: 20 },

  // AI CTA
  aiCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f97316",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  aiCtaTitle: { fontSize: 17, fontWeight: "700", color: "#fff", marginBottom: 3 },
  aiCtaSub: { fontSize: 12, color: "#fed7aa", lineHeight: 17 },
  aiCtaArrow: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },

  // Search
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },

  // Category chips
  filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipActive: { backgroundColor: "#f97316", borderColor: "#f97316" },
  chipText: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  chipTextActive: { color: "#fff", fontWeight: "700" },

  // Section header
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  seeAll: { fontSize: 13, color: "#f97316", fontWeight: "600" },

  // Grid
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 12 },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardEmoji: { fontSize: 32 },
  seasonPill: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  seasonPillText: { fontSize: 9, fontWeight: "700", color: "#fff" },
  cardName: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 2 },
  cardState: { fontSize: 11, color: "#9ca3af", marginBottom: 10 },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  styleBadge: { borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3 },
  styleBadgeText: { fontSize: 9, fontWeight: "700" },
  temp: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
});
