import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { BlurView } from "expo-blur";

function TabIcon({
  label,
  emoji,
  focused,
}: {
  label: string;
  emoji: string;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: "center", paddingTop: 6 }}>
      {/* Pill highlight behind the emoji when focused */}
      <View
        style={{
          width: focused ? 52 : 36,
          height: 28,
          borderRadius: 14,
          backgroundColor: focused ? "rgba(249,115,22,0.14)" : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: focused ? 21 : 20 }}>{emoji}</Text>
      </View>
      <Text
        style={{
          fontSize: 9.5,
          color: focused ? "#f97316" : "#9ca3af",
          marginTop: 3,
          fontWeight: focused ? "700" : "500",
          letterSpacing: 0.1,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : "rgba(255,255,255,0.96)",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 82 : 70,
          paddingBottom: Platform.OS === "ios" ? 22 : 10,
          // Soft top shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.07,
          shadowRadius: 16,
          elevation: 24,
        },
        tabBarShowLabel: false,
        // iOS: frosted glass tab bar via BlurView
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={75}
              tint="light"
              style={{
                flex: 1,
                borderTopWidth: 0.5,
                borderTopColor: "rgba(0,0,0,0.08)",
              }}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🗺️" label="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🧳" label="Trips" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎙️" label="Record" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📱" label="Publish" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
