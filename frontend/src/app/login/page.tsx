import { Card } from "@/components/ui/card";
import { Bike } from "lucide-react";
import workshopHero from "@/app/assets/workshop-hero.jpg";
import { LoginForm } from "@/components/login-form";


const Page = () => {

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${workshopHero.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/20 to-background/30" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 relative">
              <div className="absolute inset-0 blur-xl opacity-50">
                <Bike className="w-16 h-16 text-primary" />
              </div>
              <Bike className="w-16 h-16 text-primary relative" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Utama Moto Inventory</h1>
          </div>

          {/* Login Card */}
          <Card className="card-glow bg-card/50  border-border/50 p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Enter your credentials to access the system
            </p>

            <LoginForm/>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
