import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function TripsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Trips</Text>
          <Text style={styles.subtitle}>Your upcoming and past adventures</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { value: "0", label: "Planned" },
            { value: "0", label: "Completed" },
            { value: "0", label: "Countries" },
          ].map(({ value, label }, i) => (
            <View
              key={label}
              style={[
                styles.statCard,
                i < 2 && { borderRightWidth: 1, borderRightColor: "#f3f4f6" },
              ]}
            >
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Empty state */}
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            {/* Outer ring */}
            <View style={styles.emptyRing}>
              <Text style={{ fontSize: 52 }}>🧳</Text>
            </View>
          </View>

          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptyBody}>
            Plan your first adventure using the AI itinerary builder on the Explore tab.
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/")}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>✨ Start planning</Text>
          </TouchableOpacity>

          {/* Hint chips */}
          <View style={styles.hintRow}>
            {["Beach 🏖️", "Mountains 🏔️", "Culture 🪔"].map((hint) => (
              <View key={hint} style={styles.hintChip}>
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#111" },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 3 },

  // Stats
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 18 },
  statValue: { fontSize: 26, fontWeight: "800", color: "#111" },
  statLabel: { fontSize: 11, color: "#9ca3af", marginTop: 2 },

  // Empty state
  emptyState: { alignItems: "center", paddingHorizontal: 32 },
  emptyIconWrap: { marginBottom: 20 },
  emptyRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 7,
    marginBottom: 20,
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Hint chips
  hintRow: { flexDirection: "row", gap: 8 },
  hintChip: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  hintText: { fontSize: 12, color: "#6b7280", fontWeight: "500" },
});
