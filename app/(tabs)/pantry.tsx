import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import IngredientTypeahead from "../../components/inputs/IngredientTypeahead";
import { addPantryItem, deletePantryItem, listPantryItems, updatePantryItem } from "../../lib/queries/pantry";
import type { Ingredient, PantryItemRow } from "../../lib/types";

export default function PantryScreen() {
  const qc = useQueryClient();

  // READ
  const pantryQ = useQuery({
    queryKey: ["pantry"],
    queryFn: () => listPantryItems(),
  });

// CREATE
const addMut = useMutation({
  mutationFn: (ingredient_id: string | number) => addPantryItem(ingredient_id),

  // Optional UI guard: don’t optimistically add if it already exists in cache
  onMutate: async (ingredient_id) => {
    await qc.cancelQueries({ queryKey: ["pantry"] });
    const prev = qc.getQueryData<PantryItemRow[]>(["pantry"]) ?? [];

    const exists = prev.some(r => String(r.ingredient_id) === String(ingredient_id));
    if (exists) {
      // Throw to hit onError with a friendly message
      throw new Error("ALREADY_EXISTS");
    }

    const optimistic: PantryItemRow = {
      id: `optimistic-${Date.now()}`,
      ingredient_id: String(ingredient_id),
      created_at: new Date().toISOString(),
      ingredient: { name: "Adding…" },
    };
    qc.setQueryData<PantryItemRow[]>(["pantry"], [optimistic, ...prev]);
    return { prev };
  },

  onError: (err, _vars, ctx) => {
    if (ctx?.prev) qc.setQueryData(["pantry"], ctx.prev);
    const msg =
      (err as any)?.message === "ALREADY_EXISTS"
        ? "That ingredient is already in your pantry."
        : "Could not add this item. Please try again.";
    Alert.alert("Add item", msg);
  },

  // 👇 This is the bit you asked about
  onSettled: (_res, _err) => {
    // Always re-sync with the server (also clears optimistic rows)
    qc.invalidateQueries({ queryKey: ["panry"] }); // <-- typo guard: ensure key is correct!
    qc.invalidateQueries({ queryKey: ["pantry"] }); // ✅ actual key you use
  },

  // (Optional) If you want a toast only on success:
  // onSuccess: (res) => {
  //   if (res === null) {
  //     // We treated unique violation as null in addPantryItem
  //     Alert.alert("Already added", "That ingredient is already in your pantry.");
  //   }
  // },
});


  // UPDATE (swap ingredient)
  const updateMut = useMutation({
    mutationFn: ({ id, next }: { id: string | number; next: string | number }) => updatePantryItem(id, next),
    onMutate: async ({ id, next }) => {
      await qc.cancelQueries({ queryKey: ["pantry"] });
      const prev = qc.getQueryData<PantryItemRow[]>(["pantry"]) ?? [];
      const nextRows = prev.map((r) =>
        String(r.id) === String(id)
          ? { ...r, ingredient_id: String(next), ingredient: { name: "Updating…" } }
          : r
      );
      qc.setQueryData<PantryItemRow[]>(["pantry"], nextRows);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["pantry"], ctx.prev);
      Alert.alert("Update failed", "Could not update this item.");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["pantry"] });
    },
  });

  // DELETE
  const deleteMut = useMutation({
    mutationFn: (id: string | number) => deletePantryItem(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["pantry"] });
      const prev = qc.getQueryData<PantryItemRow[]>(["pantry"]) ?? [];
      qc.setQueryData<PantryItemRow[]>(
        ["pantry"],
        prev.filter((r) => String(r.id) !== String(id))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["pantry"], ctx.prev);
      Alert.alert("Delete failed", "Could not delete this item.");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["pantry"] });
    },
  });

  // Handlers
  const handleAdd = (ing: Ingredient) => addMut.mutate(ing.id);

  const renderRow = ({ item }: { item: PantryItemRow }) => (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
        gap: 8,
      }}
    >
      <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
        {item.ingredient?.name ?? "Unknown ingredient"}
      </Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={() =>
            Alert.alert(
              "Change ingredient",
              "Pick a new ingredient for this item.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Choose…",
                  onPress: () => {
                    // Quick inline chooser: show a small typeahead pop-in
                    // For simplicity here, we’ll toggle a local sheet-like row (below).
                    // In a real app, you'd open a bottom sheet/modal. See inline below.
                  },
                },
              ]
            )
          }
          style={({ pressed }) => ({
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#555",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{ color: "white" }}>Edit</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            Alert.alert(
              "Remove item",
              `Remove "${item.ingredient?.name ?? "this item"}"?`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", style: "destructive", onPress: () => deleteMut.mutate(item.id) },
              ]
            )
          }
          style={({ pressed }) => ({
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#555",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </Pressable>
      </View>

      {/* Inline quick edit: show typeahead directly under the row when tapped (simple approach) */}
      {/* You can conditionally render this based on local state; for brevity, always hidden in this snippet. */}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0b" }}>
      {/* Top: Add via ingredient search */}
      <View style={{ padding: 16 }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
          Add an ingredient
        </Text>
        <IngredientTypeahead onSelect={handleAdd} />
      </View>

      {/* Pantry list */}
      <FlatList
        data={pantryQ.data ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderRow}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={{ padding: 24 }}>
            <Text style={{ color: "#aaa" }}>
              {pantryQ.isLoading ? "Loading…" : "No items yet. Add one above!"}
            </Text>
          </View>
        }
        refreshing={pantryQ.isRefetching}
        onRefresh={() => pantryQ.refetch()}
      />
    </View>
  );
}
