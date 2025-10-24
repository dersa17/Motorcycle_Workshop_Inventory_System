import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as supplierService from "@/services/supplier-service"


export const useSupplier = () => {
    return useQuery({
            queryKey: ["supplier"],
            queryFn: supplierService.getAllSupplier,
            staleTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
    })
}

export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierService.createSupplier, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] }); 
    },
  });
};

export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierService.updateSupplier, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] }); 
    },
  });
};


export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierService.deleteSupplier, 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["supplier"] }); 
    },
  });
};


