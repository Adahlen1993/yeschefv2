// app/(tabs)/recipes.tsx
import { Link } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useAvailableGlobalRecipes } from '../../lib/hooks/useGlobalRecipes';

export default function RecipesTab() {
  const { data, isLoading, isError } = useAvailableGlobalRecipes();

  if (isLoading) return <Text>Loading recipes…</Text>;
  if (isError) return <Text>Couldn’t load recipes.</Text>;
  if (!data || data.length === 0) {
    return <Text>You don’t have ingredients for any global recipes yet.</Text>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(r) => String(r.id)}
      renderItem={({ item }) => (
        <View style={{ padding: 12, gap: 6 }}>
          <Text style={{ fontWeight: '600' }}>{item.title}</Text>
          {!!item.description && <Text numberOfLines={2}>{item.description}</Text>}

          <Link
            href={{ pathname: '/recipes/[id]', params: { id: String(item.id) } }}
            asChild
          >
            <Pressable>
              <Text>View Recipe →</Text>
            </Pressable>
          </Link>
        </View>
      )}
    />
  );
}
