/**
 * Record Tab — ContentPilot quick-access.
 * One large mic button. Tap to record a voice note → AI converts to content.
 * Full implementation in Phase 2 — this is the Phase 0 shell.
 */
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ color: "#f97316", fontSize: 14, fontWeight: "600", letterSpacing: 2, marginBottom: 8 }}>
          CONTENT PILOT
        </Text>
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 40 }}>
          Tap. Talk. Publish.
        </Text>

        {/* Big mic button */}
        <TouchableOpacity
          style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: "#f97316",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#f97316",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 30,
          }}
        >
          <Text style={{ fontSize: 52 }}>🎙️</Text>
        </TouchableOpacity>

        <Text style={{ color: "#6b7280", marginTop: 32, textAlign: "center", lineHeight: 22 }}>
          Voice recording with AI transcription{"\n"}coming in Phase 2
        </Text>
      </View>
    </SafeAreaView>
  );
}
