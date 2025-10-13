"use client";
import { useMe } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isPending, error } = useMe();
  const router = useRouter();
  const toastShown = useRef(false); // supaya toast cuma muncul sekali

  useEffect(() => {
    if (!isPending && (error || !data)) {
      if (!toastShown.current) {
        toast.error("Anda harus Sign In terlebih dahulu.");
        toastShown.current = true;
      }
      router.replace("/login");
    }
  }, [data, error, isPending, router]);

  if (isPending || !data )
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );

  return <>{children}</>;
}
