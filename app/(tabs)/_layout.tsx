import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#ffd33d',
            headerStyle: {
            backgroundColor: '#25292e',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
            backgroundColor: '#25292e',
            },
        }}
        >
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'barcode' : 'barcode-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry Storage',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
