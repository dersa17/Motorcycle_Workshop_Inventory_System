import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserProfile } from "@/components/user-profile"
import { AuthGuard } from "@/components/auth-guard"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center">
              <SidebarTrigger />
              
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <UserProfile />
            </div>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
    </AuthGuard>
    
  )
}
