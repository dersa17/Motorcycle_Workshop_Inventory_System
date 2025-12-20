import { useQuery } from "@tanstack/react-query";
import * as dashboardService from "@/services/dashboard-service"
    

export const useDashboard = () => {
    return useQuery({
            queryKey: ["dashboard"],
            queryFn: dashboardService.getDataDashboard,
            staleTime: 1000 * 60 * 30,
            refetchOnWindowFocus: "always",
            refetchOnMount: "always"
    })
}
