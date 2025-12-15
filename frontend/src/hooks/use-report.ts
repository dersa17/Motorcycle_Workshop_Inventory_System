import { useQuery } from "@tanstack/react-query";
import * as reportService from "@/services/report-service"



export const usePurchaseReport = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ["purchaseReport", startDate, endDate],
    queryFn: () => reportService.getPurchaseReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};



export const useSalesReport = (startDate: Date | undefined, endDate: Date | undefined) => {
    return useQuery({
        queryKey: ["salesReport", startDate, endDate],
        queryFn: () => reportService.getSalesReport(startDate, endDate),
        enabled: !!startDate && !!endDate,
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false
    })
}

export const useItemsReport = (startDate: Date | undefined, endDate: Date | undefined) => {
    return useQuery({
        queryKey: ["itemsReport", startDate, endDate],
        queryFn: () => reportService.getItemsReport(startDate, endDate),
        enabled: !!startDate && !!endDate,
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false
    })
}

export const useProfitLossReport = (startDate: Date | undefined, endDate: Date | undefined) => {
    return useQuery({
        queryKey: ["profitLossReport", startDate, endDate],
        queryFn: () => reportService.getProfitLossReport(startDate, endDate),
        enabled: !!startDate && !!endDate,
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false
    })
}


