import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { searchIngredients } from "../../lib/queries/ingredients";
import type { Ingredient } from "../../lib/types";

function useDebounced(value: string, delay = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

type Props = {
  placeholder?: string;
  maxResults?: number;
  onSelect: (ingredient: Ingredient) => void;
  style?: any;
};

export default function IngredientTypeahead({
  placeholder = "Search ingredients…",
  maxResults = 20,
  onSelect,
  style,
}: Props) {
  const [query, setQuery] = React.useState("");
  const debounced = useDebounced(query, 300);

  const resultsQ = useQuery({
    queryKey: ["ingredient-search", debounced, maxResults],
    queryFn: () => (debounced ? searchIngredients(debounced, maxResults) : Promise.resolve([])),
  });

  // 🔎 TEMP DEBUG — add these two lines
  console.log("ingredient search status:", resultsQ.status, "error:", resultsQ.error);
  console.log("ingredient search rows:", resultsQ.data);


  return (
    <View style={style}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor="#888"
        style={{
          backgroundColor: "#141414",
          color: "white",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#222",
        }}
        accessibilityLabel="Search ingredients"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {debounced.length > 0 && (
        <View style={{ marginTop: 8, maxHeight: 280, borderWidth: 1, borderColor: "#222", borderRadius: 10 }}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={resultsQ.data ?? []}
            keyExtractor={(i) => String(i.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  setQuery(""); // clear after choose
                }}
                style={({ pressed }) => ({
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  backgroundColor: pressed ? "#181818" : "#121212",
                  borderBottomWidth: 1,
                  borderBottomColor: "#1c1c1c",
                })}
                accessibilityLabel={`Choose ${item.name}`}
              >
                <Text style={{ color: "white", fontSize: 16 }}>{item.name}</Text>
                <Text style={{ color: "#888", fontSize: 12, marginTop: 2 }}>ID: {String(item.id)}</Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={{ padding: 12 }}>
                <Text style={{ color: "#aaa" }}>
                  {resultsQ.isFetching ? "Searching…" : "No matches"}
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}
