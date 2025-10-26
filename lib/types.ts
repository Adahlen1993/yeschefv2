// Basic shared shapes used across Pantry + Ingredients UI/queries.

export type Id = number | string; // BIGINT or UUID

export type Ingredient = {
  id: Id;
  name: string;
};

export type PantryItemRow = {
  id: Id;
  ingredient_id: Id;
  created_at: string | null;
  // Optional nested join when selecting with a relation alias (e.g., ingredient:ingredients(name))
  ingredient?: { name: string } | null;
};

// (for later phases when you support user-defined ingredients)
export type UserIngredient = {
  id: Id;
  name: string;
  created_at?: string | null;
};
