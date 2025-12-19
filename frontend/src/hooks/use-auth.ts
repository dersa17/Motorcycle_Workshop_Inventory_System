import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/auth-service";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] }); 
    },
  });
};


export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] }); 
    },
  });
};


export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["me"]})
    }
  })
}