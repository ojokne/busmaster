import { Tabs } from 'expo-router';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarButtonTestID: 'homeTab',
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sell-ticket"
        options={{
          tabBarButtonTestID: 'sellTicketTab',
          title: 'Sell Ticket',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="bus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButtonTestID: 'profileTab',
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
