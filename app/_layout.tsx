import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSessionStore } from '../store/session';

export default function RootLayout() {
  const { init, user, loading } = useSessionStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => { void init(); }, [init]);

  useEffect(() => {
    if (loading) return;
    const inAuth = pathname?.startsWith('/login') || pathname?.startsWith('/register');
    if (!user && !inAuth) router.replace('/login');
    else if (user && inAuth) router.replace('/pantry');
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
