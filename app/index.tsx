import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useSessionStore } from '../store/session';

export default function IndexRedirect() {
  const router = useRouter();
  const { user } = useSessionStore();

  useEffect(() => {
    router.replace(user ? '/pantry' : '/login');
  }, [user, router]);

  return null;
}
