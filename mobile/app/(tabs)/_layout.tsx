import { Tabs } from "expo-router";
import { View, Text } from "react-native";

function TabIcon({ label, emoji, focused }: { label: string; emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: "center", paddingTop: 4 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, color: focused ? "#f97316" : "#9ca3af", marginTop: 2 }}>
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
          backgroundColor: "#fff",
          borderTopColor: "#f3f4f6",
          height: 72,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" label="Explore" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🧳" label="Trips" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎙️" label="Record" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📱" label="Publish" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
