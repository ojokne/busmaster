import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 24,
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShadowVisible: false,
          title: 'Available Trips',
        }}
      />
      <Stack.Screen
        name="bus-layout/[id]"
        options={{
          headerShadowVisible: false,
          title: 'Bus Layout',
        }}
      />
    </Stack>
  );
}
