import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar + identity */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={{ fontSize: 40 }}>👤</Text>
            </View>
          </View>
          <Text style={styles.name}>Guest User</Text>
          <Text style={styles.nameSub}>Sign in to save trips and unlock all features</Text>
          <TouchableOpacity style={styles.signInBtn} activeOpacity={0.85}>
            <Text style={styles.signInText}>Sign in / Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { value: "0", label: "Trips" },
            { value: "0", label: "Countries" },
            { value: "0", label: "Days" },
          ].map(({ value, label }, i) => (
            <View
              key={label}
              style={[
                styles.statCell,
                i < 2 && { borderRightWidth: 1, borderRightColor: "#f3f4f6" },
              ]}
            >
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Plan card */}
        <View style={styles.planCard}>
          {/* Plan header */}
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Free Plan</Text>
              <Text style={styles.planMeta}>Current plan</Text>
            </View>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>FREE</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Features */}
          <View style={styles.featureList}>
            {[
              { text: "3 AI itineraries / month",   included: true },
              { text: "3 social posts / month",     included: true },
              { text: "Unlimited AI itineraries",   included: false },
              { text: "Priority AI processing",     included: false },
              { text: "Advanced analytics",         included: false },
            ].map(({ text, included }) => (
              <View key={text} style={styles.featureRow}>
                <Text style={[styles.featureIcon, !included && { opacity: 0.3 }]}>
                  {included ? "✓" : "✗"}
                </Text>
                <Text style={[styles.featureText, !included && styles.featureTextLocked]}>
                  {text}
                </Text>
              </View>
            ))}
          </View>

          {/* Upgrade CTA */}
          <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.85}>
            <Text style={styles.upgradeText}>⚡ Upgrade to Creator — ₹499/mo</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: "800", color: "#111" },

  // Avatar
  avatarSection: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 24 },
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "rgba(249,115,22,0.12)",
    borderWidth: 2, borderColor: "rgba(249,115,22,0.28)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  avatarInner: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#fed7aa",
    alignItems: "center", justifyContent: "center",
  },
  name: { fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 4 },
  nameSub: {
    fontSize: 13, color: "#9ca3af", textAlign: "center",
    lineHeight: 19, marginBottom: 20,
  },
  signInBtn: {
    backgroundColor: "#f97316",
    paddingHorizontal: 32, paddingVertical: 12, borderRadius: 14,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 12,
    elevation: 6,
  },
  signInText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Stats
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: "#fff", borderRadius: 20, overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10,
    elevation: 3,
  },
  statCell: { flex: 1, alignItems: "center", paddingVertical: 18 },
  statValue: { fontSize: 26, fontWeight: "800", color: "#111" },
  statLabel: { fontSize: 11, color: "#9ca3af", marginTop: 2 },

  // Plan card
  planCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff", borderRadius: 20, padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10,
    elevation: 3,
  },
  planHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 16,
  },
  planName: { fontSize: 17, fontWeight: "800", color: "#111" },
  planMeta: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  planBadge: {
    backgroundColor: "#f3f4f6", borderRadius: 9,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  planBadgeText: { fontSize: 11, fontWeight: "700", color: "#6b7280" },

  divider: { height: 1, backgroundColor: "#f3f4f6", marginBottom: 14 },

  featureList: { gap: 9, marginBottom: 20 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureIcon: { fontSize: 14, color: "#f97316", fontWeight: "700", width: 16 },
  featureText: { fontSize: 13, color: "#374151" },
  featureTextLocked: { color: "#d1d5db" },

  upgradeBtn: {
    backgroundColor: "#f97316", borderRadius: 14, padding: 14,
    alignItems: "center",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 12,
    elevation: 6,
  },
  upgradeText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
