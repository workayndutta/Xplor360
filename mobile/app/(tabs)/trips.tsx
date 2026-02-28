import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "800" }}>My Trips</Text>
          <Text style={{ color: "#6b7280", marginTop: 4 }}>
            Your upcoming and past adventures
          </Text>

          {/* Empty state */}
          <View style={{ alignItems: "center", paddingTop: 80 }}>
            <Text style={{ fontSize: 48 }}>🧳</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 16, color: "#111" }}>
              No trips yet
            </Text>
            <Text style={{ color: "#9ca3af", marginTop: 8, textAlign: "center", lineHeight: 22 }}>
              Plan your first trip using the AI itinerary builder on the Explore tab.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
