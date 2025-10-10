import { Text, View } from 'react-native';

export default function PantryScreen() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Text>Pantry — coming soon</Text>
      <Text selectable>Env OK? {url ? 'yes' : 'no'}</Text>
    </View>
  );
}
