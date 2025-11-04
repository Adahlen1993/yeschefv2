// app/recipes/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

// ✅ Use the GLOBAL (read-only) hooks/queries
import { useGlobalRecipe } from '../../lib/hooks/useGlobalRecipes';
import { getGlobalMatchStatus } from '../../lib/queries/globalRecipes';

export default function RecipeDetail() {
  const params = useLocalSearchParams();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const recipeId = useMemo(() => Number(idParam), [idParam]);

  const { data: recipe, isLoading, isError } =
    useGlobalRecipe(Number.isFinite(recipeId) ? recipeId : (undefined as unknown as number));

  const [match, setMatch] = useState<{ ingredient_id: number; in_pantry: boolean }[] | null>(null);

  useEffect(() => {
    if (!Number.isFinite(recipeId)) return;
    getGlobalMatchStatus(recipeId).then(setMatch).catch(() => setMatch(null));
  }, [recipeId]);

  if (!Number.isFinite(recipeId)) return <Text>Invalid recipe id.</Text>;
  if (isLoading) return <Text>Loading…</Text>;
  if (isError || !recipe) return <Text>Not found.</Text>;

  const have = match?.filter(m => m.in_pantry).length ?? 0;
  const total = match?.length ?? 0;

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{recipe.title}</Text>
      {!!recipe.description && <Text>{recipe.description}</Text>}
      {!!total && <Text>Ingredients on hand: {have}/{total}</Text>}

      <Text style={{ fontWeight: '600', marginTop: 8 }}>Ingredients</Text>
      {recipe.ingredients?.map((ri: any) => (
        <Text key={ri.id}>
          • {ri.quantity ?? ''} {ri.unit ?? ''} {ri.ingredient?.name ?? `#${ri.ingredient_id}`}
        </Text>
      ))}

      {!!recipe.instructions && (
        <>
          <Text style={{ fontWeight: '600', marginTop: 8 }}>Instructions</Text>
          <Text>{recipe.instructions}</Text>
        </>
      )}
    </View>
  );
}
