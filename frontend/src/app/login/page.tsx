"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Bike, Lock, User } from "lucide-react";
import workshopHero from "@/app/assets/workshop-hero.jpg"
const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    // Handle login logic here
    console.log("Login attempt:", { username, password });
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${workshopHero.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
       <div className="absolute inset-0 
  bg-gradient-to-br 
  from-background/30 via-background/20 to-background/30 
  dark:from-background/85 dark:via-background/80 dark:to-background/85"
/>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-50">
                  <Bike className="w-16 h-16 text-primary" />
                </div>
                <Bike className="w-16 h-16 text-primary relative" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Utama Moto Inventory
            </h1>
          </div>

          {/* Login Card */}
          <Card className="card-glow bg-card/50 backdrop-blur-sm border-border/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-center text-foreground">
                  Welcome Back
                </h2>
                <p className="text-sm text-muted-foreground text-center">
                  Enter your credentials to access the system
                </p>
              </div>

              <div className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) {
                          setErrors({ ...errors, username: undefined });
                        }
                      }}
                      className={`pl-10 bg-input/50 border-border focus:border-primary transition-all ${
                        errors.username ? "border-destructive" : ""
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors({ ...errors, password: undefined });
                        }
                      }}
                      className={`pl-10 bg-input/50 border-border focus:border-primary transition-all ${
                        errors.password ? "border-destructive" : ""
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border bg-input accent-primary"
                    />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base font-semibold"
                >
                  Sign In
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/20 rounded-full blur-sm" />
      <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-primary/10 rounded-full blur-sm" />
    </div>
  );
};

export default Page;
