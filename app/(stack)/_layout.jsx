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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-trip"
        options={{ headerShadowVisible: false, title: 'Create Trip' }}
      />
      <Stack.Screen
        name="scan-qrcode"
        options={{ headerShadowVisible: false, title: 'Scan QR Code' }}
      />
      <Stack.Screen
        name="verify-ticket"
        options={{ headerShadowVisible: false, title: 'Ticket Verification' }}
      />
    </Stack>
  );
}
