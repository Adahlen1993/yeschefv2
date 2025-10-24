import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onRegister = async () => {
    const trimmed = email.trim();
    if (!trimmed || !password) return Alert.alert('Missing info', 'Please enter email and password.');
    if (password.length < 6) return Alert.alert('Weak password', 'Min 6 characters.');
    try {
      setSubmitting(true);
      const { data, error } = await supabase.auth.signUp({ email: trimmed, password });
      if (error) throw error;

      const needsConfirm = !data?.session;
      Alert.alert(
        'Account created',
        needsConfirm ? 'Check your email to confirm, then sign in.' : 'You are signed in.'
      );

      router.replace(needsConfirm ? '/login' : '/pantry');
    } catch (err: any) {
      Alert.alert('Registration failed', err?.message ?? 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 8 }}>Create account</Text>

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
        placeholder="Min 6 characters"
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />

      <Button title={submitting ? 'Creating…' : 'Create account'} onPress={onRegister} disabled={submitting} />

      <View style={{ marginTop: 12, alignItems: 'center' }}>
        <Link href="/login" asChild>
          <Text style={{ textDecorationLine: 'underline' }}>Back to login</Text>
        </Link>
      </View>
    </View>
  );
}
