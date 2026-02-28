/**
 * Record Tab — ContentPilot quick-access.
 * Dark screen with concentric ring animation around the mic button.
 * Full implementation in Phase 2.
 */
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>

        {/* Label + headline */}
        <Text style={styles.label}>CONTENT PILOT</Text>
        <Text style={styles.headline}>Tap. Talk. Publish.</Text>

        {/* Concentric rings + mic button */}
        <View style={styles.ring3}>
          <View style={styles.ring2}>
            <View style={styles.ring1}>
              <TouchableOpacity style={styles.micBtn} activeOpacity={0.8}>
                <Text style={{ fontSize: 52 }}>🎙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Coming soon note */}
        <Text style={styles.comingSoon}>
          Voice recording with AI transcription{"\n"}coming in Phase 2
        </Text>

        {/* Feature chips */}
        <View style={styles.chipRow}>
          {["AI Transcription", "Auto Captions", "Smart Edit"].map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  inner: {
    flex: 1, alignItems: "center", justifyContent: "center", padding: 24,
  },

  label: {
    color: "#f97316", fontSize: 12, fontWeight: "700",
    letterSpacing: 3, marginBottom: 8,
  },
  headline: {
    color: "#fff", fontSize: 30, fontWeight: "800",
    textAlign: "center", marginBottom: 52,
  },

  // Concentric rings (outermost → innermost)
  ring3: {
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: "rgba(249,115,22,0.03)",
    borderWidth: 1, borderColor: "rgba(249,115,22,0.08)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 44,
  },
  ring2: {
    width: 210, height: 210, borderRadius: 105,
    backgroundColor: "rgba(249,115,22,0.05)",
    borderWidth: 1, borderColor: "rgba(249,115,22,0.14)",
    alignItems: "center", justifyContent: "center",
  },
  ring1: {
    width: 152, height: 152, borderRadius: 76,
    backgroundColor: "rgba(249,115,22,0.08)",
    borderWidth: 1, borderColor: "rgba(249,115,22,0.22)",
    alignItems: "center", justifyContent: "center",
  },
  micBtn: {
    width: 118, height: 118, borderRadius: 59,
    backgroundColor: "#f97316",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65, shadowRadius: 28,
    elevation: 12,
  },

  comingSoon: {
    color: "#4b5563", textAlign: "center", lineHeight: 24, marginBottom: 28,
    fontSize: 14,
  },

  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  chip: {
    backgroundColor: "rgba(249,115,22,0.1)",
    borderWidth: 1, borderColor: "rgba(249,115,22,0.2)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
  },
  chipText: { color: "#fb923c", fontSize: 12, fontWeight: "600" },
});
