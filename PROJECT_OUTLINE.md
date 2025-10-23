# 🍳 YesChef v2 — Project Outline & Roadmap

> **Purpose:** Help users track pantry ingredients and discover what recipes they can cook — enhanced with barcode and receipt AI input.

---

## ✅ MVP Checklist (Phase 1)

### 1. Project Setup
- [ ] Initialize Expo project with Expo Router (TypeScript)
- [ ] Add dependencies  
  `@supabase/supabase-js`, `@tanstack/react-query`, `@react-native-async-storage/async-storage`, `zod`
- [ ] Configure `.env` with Supabase URL + anon key
- [ ] Create `lib/supabase.ts` client
- [ ] Wrap app with `QueryClientProvider`
- [ ] Push repo to GitHub

### 2. Supabase Backend
- [ ] Create Supabase project
- [ ] Create schema (see `/supabase/schema.sql`)
  - [ ] `users` (Auth handled by Supabase)
  - [ ] `units`
  - [ ] `ingredients`, `ingredient_aliases`
  - [ ] `pantry_items`
  - [ ] `recipes`, `recipe_ingredients`
  - [ ] `barcodes`
  - [ ] `receipt_uploads`, `receipt_items`
- [ ] Add RLS policies
  - [ ] Pantry → user-only
  - [ ] Ingredients → public + personal
  - [ ] Recipes → public + own
- [ ] Seed base data (`units`, sample `ingredients`, sample `recipes`)
- [ ] Create RPC: `create_or_get_personal_ingredient(name)`
- [ ] Create view: `ingredient_search_v2`

### 3. Authentication & Settings
- [ ] Supabase email/password login + signup
- [ ] Persist session with AsyncStorage
- [ ] Settings tab with logout button (and placeholder toggles)

### 4. Pantry Tab
- [ ] Display current pantry list (ingredient, qty, unit)
- [ ] Empty-state message (“Your pantry is empty”)
- [ ] Typeahead search (≥2 chars, debounce 300 ms)
- [ ] “Add Ingredient” flow  
  - [ ] Pick ingredient → quantity/unit modal → insert/merge
  - [ ] If not found → create personal ingredient
- [ ] Edit qty/unit
- [ ] Remove pantry item
- [ ] Toasts for success/error
- [ ] Basic loading + error UI

### 5. Recipes Tab
- [ ] Fetch all public + personal recipes
- [ ] Client-side matching  
  - [ ] **Makeable:** all ingredients in pantry  
  - [ ] **Almost:** ≤ 3 ingredients missing
- [ ] Render two lists (“Makeable” / “Almost”)
- [ ] Recipe detail → show ✅ present / ❌ missing
- [ ] Simple responsive layout (mobile/web)

---

## ⚙️ Phase 1.5 — Input Capture (Barcode & Receipt AI)

### Barcode Scan
- [ ] Add Expo camera permissions + scanner view
- [ ] On scan → lookup in `barcodes`
- [ ] If found → autofill modal (ingredient + default qty/unit)
- [ ] If not found → typeahead select/create → save mapping for next time

### Receipt Upload + AI Confirmation
- [ ] Add “Import Receipt” button (camera / gallery)
- [ ] Upload image to Supabase Storage → create `receipt_uploads(status='uploaded')`
- [ ] Stub parser (split lines → populate `receipt_items`)
- [ ] Q&A review wizard
  - [ ] Confirm ambiguous `name_raw` (“Is *grlc powdr* → Garlic Powder?”)
  - [ ] Confirm qty/unit if missing
  - [ ] Confirm duplicates
- [ ] On confirm → insert/merge to `pantry_items`, mark upload `status='confirmed'`
- [ ] (Later) Replace stub parser with OCR + LLM service

---

## 🧭 Architecture & Utilities
- [ ] React Query hooks for `pantry` and `recipes`
- [ ] Shared UI components: `Typeahead`, `Modal`, `Toast`
- [ ] Utility helpers: `normalizeName`, `mergePantryItems`
- [ ] Cross-platform styles (simple, mobile-first)
- [ ] `.gitignore`, `README.md`, `PROJECT_OUTLINE.md` included

---

## 🧩 Definition of Done (for MVP)
- [ ] User can sign up / log in / log out
- [ ] User can add / edit / remove ingredients in pantry
- [ ] User can upload a receipt photo and confirm parsed items
- [ ] Recipes tab correctly shows **Makeable** and **Almost**
- [ ] Runs on iOS / Android / Web
- [ ] Verified RLS: no cross-user access

---

## 🚀 Future Roadmap

### Phase 2 — AI Enhancements
- [ ] OCR + LLM pipeline for receipts (Supabase Edge Function)
- [ ] Improved barcode database (online lookup)
- [ ] AI ingredient normalization + auto-unit detection

### Phase 3 — User Recipes & Cooking Flow
- [ ] Create / edit personal recipes
- [ ] Guided cooking mode (step-by-step like GPS)
- [ ] Cooking sessions → auto-update pantry
- [ ] Auto-add depleted items to shopping list

### Phase 4 — Personalization & Social
- [ ] Liked / Saved recipes
- [ ] Following other users / shared recipes
- [ ] User preferences (diet, allergies, cuisines)

### Phase 5 — Advanced Features
- [ ] Unit conversions + quantity-aware matching
- [ ] Weekly meal planner & shopping list generator
- [ ] AI meal suggestions based on remaining ingredients

---

## 📚 Resources
- [Supabase Docs](https://supabase.com/docs)
- [Expo Router Guide](https://expo.github.io/router/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Native Camera](https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/)

---

### 💡 Tip
Mark progress by replacing `[ ]` → `[x]` as you complete each task.
This file stays as your master progress tracker for **YesChef v2**.
