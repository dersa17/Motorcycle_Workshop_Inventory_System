"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-auth"; // hook react-query
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: user, error, isFetching } = useMe();

  useEffect(() => {
    if (!isFetching) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, error, isFetching, router]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );
}
