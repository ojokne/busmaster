import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { enableBluetooth } from '../../../../utils';

export default function Layout() {
  useEffect(() => {
    enableBluetooth();
  }, []);
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
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="checkout"
        options={{
          headerShadowVisible: false,
          title: 'Checkout',
        }}
      />
    </Stack>
  );
}
