import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PublishScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>SocialLaunch</Text>
        <Text style={{ color: "#6b7280", marginTop: 4 }}>
          Schedule and publish your travel content
        </Text>
        <View style={{ alignItems: "center", paddingTop: 80 }}>
          <Text style={{ fontSize: 48 }}>📲</Text>
          <Text style={{ fontSize: 16, color: "#9ca3af", marginTop: 16, textAlign: "center" }}>
            Connect Instagram, YouTube, and more{"\n"}to start auto-publishing — coming Phase 3
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
