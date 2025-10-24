import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onLogin = async () => {
    if (!email || !password) return Alert.alert('Missing info', 'Please enter email and password.');
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace('/pantry');
    } catch (err: any) {
      Alert.alert('Login failed', err?.message ?? 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 8 }}>Welcome back</Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="you@example.com"
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />

      <Button title={submitting ? 'Signing in…' : 'Sign in'} onPress={onLogin} disabled={submitting} />

      <View style={{ marginTop: 12, alignItems: 'center' }}>
        <Link href="/register" asChild>
          <Text style={{ textDecorationLine: 'underline' }}>Create an account</Text>
        </Link>
      </View>
    </View>
  );
}
