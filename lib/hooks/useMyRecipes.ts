import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../queries/userRecipes';
import { qk } from '../queryKeys';

export function useMyRecipes(userId: string) {
  return useQuery({ queryKey: qk.myRecipes, queryFn: () => api.listMyRecipes(userId), enabled: !!userId });
}

export function useCreateMyRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createMyRecipe,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.myRecipes }),
  });
}

export function useUpdateMyRecipe(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Parameters<typeof api.updateMyRecipe>[1]) => api.updateMyRecipe(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.myRecipe(id) });
      qc.invalidateQueries({ queryKey: qk.myRecipes });
    },
  });
}

export function useDeleteMyRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteMyRecipe,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.myRecipes }),
  });
}
