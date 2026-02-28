import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>Profile</Text>

        <View style={{ alignItems: "center", paddingTop: 40 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#fed7aa",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 16 }}>Guest</Text>
          <Text style={{ color: "#9ca3af", marginTop: 4 }}>Sign in to save your trips</Text>

          <TouchableOpacity
            style={{
              marginTop: 24,
              backgroundColor: "#f97316",
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Sign in / Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Plan info */}
        <View style={{ marginTop: 48, backgroundColor: "#fff7ed", borderRadius: 14, padding: 16 }}>
          <Text style={{ fontWeight: "700", fontSize: 15 }}>Free Plan</Text>
          <Text style={{ color: "#9ca3af", marginTop: 4, fontSize: 13 }}>
            3 AI itineraries/month · 3 social posts/month
          </Text>
          <TouchableOpacity style={{ marginTop: 12 }}>
            <Text style={{ color: "#f97316", fontWeight: "600", fontSize: 13 }}>
              Upgrade to Creator — ₹499/month →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
