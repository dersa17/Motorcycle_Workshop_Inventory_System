import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "@/services/category-service"

// export const useCategory = () => {
//   return useQuery({
//     queryKey: ["category"],
//     queryFn: categoryService.getAllCategory,
//     staleTime: 1000 * 60 * 30,
//     refetchOnWindowFocus: false,
//   });
// };


export const useActiveCategory = () => {
      return useQuery({
        queryKey: ["activeCategory"],
        queryFn: categoryService.getActiveCategory,
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })
}

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.createCategory, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeCategory"] }); 
    },
  });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.updateCategory, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeCategory"] }); 
    },
  });
};


export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory, 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["activeCategory"] }); 
    },
  });
};

export const useRestoreCategory = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.restoreCategory, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeCategory"] }); 
    },
  });
};







