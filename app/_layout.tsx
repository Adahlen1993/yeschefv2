import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSessionStore } from '../store/session';

// ✅ React Query
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';

function onAppStateChange(status: string) {
  // Let React Query know when the app is focused (helps background refetch behavior)
  focusManager.setFocused(status === 'active');
}

export default function RootLayout() {
  const { init, user, loading } = useSessionStore();
  const pathname = usePathname();
  const router = useRouter();

  // Create the client once
  const [queryClient] = React.useState(() => new QueryClient());

  useEffect(() => { void init(); }, [init]);

  useEffect(() => {
    if (loading) return;
    const inAuth = pathname?.startsWith('/login') || pathname?.startsWith('/register');
    if (!user && !inAuth) router.replace('/login');
    else if (user && inAuth) router.replace('/pantry');
  }, [user, loading, pathname, router]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, []);

  if (loading) {
    // (Provider here is optional during loading, but safe to include)
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <QueryClientProvider client={queryClient}>
            <ActivityIndicator size="large" />
          </QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* ✅ Wrap the navigation stack with QueryClientProvider */}
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
