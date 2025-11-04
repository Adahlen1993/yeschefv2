import { useQuery } from '@tanstack/react-query';
import * as api from '../queries/globalRecipes';
import { qk } from '../queryKeys';

export function useAvailableGlobalRecipes() {
  return useQuery({ queryKey: qk.availableGlobal, queryFn: api.listAvailableGlobalRecipes });
}

export function useGlobalRecipe(id: number) {
  return useQuery({ queryKey: qk.globalRecipe(id), queryFn: () => api.getGlobalRecipe(id), enabled: !!id });
}
