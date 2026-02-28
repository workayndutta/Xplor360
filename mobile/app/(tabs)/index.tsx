/**
 * Explore Tab — SmartTrip entry point.
 * Shows destination discovery cards and the AI itinerary builder CTA.
 */
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const FEATURED_DESTINATIONS = [
  { name: "Spiti Valley", state: "Himachal Pradesh", emoji: "🏔️", style: "adventure" },
  { name: "Varanasi", state: "Uttar Pradesh", emoji: "🪔", style: "cultural" },
  { name: "Coorg", state: "Karnataka", emoji: "☕", style: "leisure" },
  { name: "Char Dham", state: "Uttarakhand", emoji: "🛕", style: "pilgrimage" },
  { name: "Andaman", state: "Andaman & Nicobar", emoji: "🏖️", style: "leisure" },
  { name: "Ladakh", state: "UT of J&K", emoji: "🏍️", style: "adventure" },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#111" }}>
            Namaste 👋
          </Text>
          <Text style={{ fontSize: 15, color: "#6b7280", marginTop: 2 }}>
            Where do you want to go next?
          </Text>
        </View>

        {/* Search bar */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
          <TextInput
            placeholder="Search destinations, expeditions..."
            placeholderTextColor="#9ca3af"
            style={{
              backgroundColor: "#f3f4f6",
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 15,
              color: "#111",
            }}
          />
        </View>

        {/* AI Itinerary CTA */}
        <TouchableOpacity
          onPress={() => router.push("/itinerary/new")}
          style={{
            marginHorizontal: 20,
            marginVertical: 8,
            backgroundColor: "#f97316",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}>
            ✨ Plan with AI
          </Text>
          <Text style={{ fontSize: 13, color: "#fed7aa", marginTop: 4 }}>
            Tell me your destination — I'll handle the rest
          </Text>
        </TouchableOpacity>

        {/* Destinations */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontSize: 17, fontWeight: "700", marginBottom: 12, color: "#111" }}>
            Popular right now
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {FEATURED_DESTINATIONS.map((d) => (
              <TouchableOpacity
                key={d.name}
                style={{
                  width: "47%",
                  backgroundColor: "#fff7ed",
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#fed7aa",
                }}
              >
                <Text style={{ fontSize: 32 }}>{d.emoji}</Text>
                <Text style={{ fontSize: 14, fontWeight: "700", marginTop: 8, color: "#111" }}>
                  {d.name}
                </Text>
                <Text style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{d.state}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
