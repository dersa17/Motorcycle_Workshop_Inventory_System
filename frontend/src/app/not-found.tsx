"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Wrench } from "lucide-react"

const NotFound = () => {
 

  

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <Wrench className="w-24 h-24 mx-auto text-muted-foreground/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-8xl font-bold text-gradient">404</h1>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you are looking for doesnt exist or has been moved to another location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/dashboard">
            <Button variant="default" className="gap-2">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
