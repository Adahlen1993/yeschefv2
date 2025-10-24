import { Alert, Button, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AccountScreen() {
  const onSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Sign out failed', error.message);
  };
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', gap:12 }}>
      <Text>Account</Text>
      <Button title="Sign out" onPress={onSignOut} />
    </View>
  );
}
