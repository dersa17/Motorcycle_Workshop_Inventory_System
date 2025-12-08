import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as transactionService from "@/services/transaction-service";


export const useTransactions = () => {
    return useQuery({
            queryKey: ["transaction"],
            queryFn: transactionService.getAllTransactions,
            staleTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
    })
}

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.createTransaction, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] }); 
       queryClient.invalidateQueries({ queryKey: ["Item"] }); 
    },
  });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.updateTransaction, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] }); 
        queryClient.invalidateQueries({ queryKey: ["Item"] });
    },
  });
};



