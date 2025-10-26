import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as itemService from "@/services/item-service"


export const useItem = () => {
    return useQuery({
            queryKey: ["Item"],
            queryFn: itemService.getAllItem,
            staleTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
    })
}

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemService.createItem, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Item"] }); 
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}: {id: string, data: FormData}) => itemService.updateItem(id, data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Item"] }); 
    },
  });
};


export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemService.deleteItem, 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["Item"] }); 
    },
  });
};

