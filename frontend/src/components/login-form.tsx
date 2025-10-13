"use client";
import { useLogin } from "@/hooks/use-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import { AxiosError } from "axios";
import { loginSchema } from "@/schemas/auth-schema";
import { LoaderCircle } from "lucide-react";
import {toast} from "sonner"
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const loginMutation = useLogin();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
       router.push("/dashboard");
      },
      onError: (err: unknown) => {
        const error = err as AxiosError<{ error: string }>;
        const msg = error.response?.data;
        if (msg?.error) toast.error(msg.error);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="Enter username"
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter password"
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

            <Button type="submit" size="lg" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
            <LoaderCircle className="w-4 h-4 animate-spin" />
            Signing in...
            </span>
        ) : (
            "Sign In"
        )}
        </Button>
      </form>
    </Form>
  );
};
