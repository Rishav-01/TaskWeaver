"use client";

import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bot, Chrome } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormProps } from "@/types/loginFormTypes";
import { Snackbar } from "../common/Snackbar";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginData, loginFormSchema } from "@/types/authType";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm = ({ setAuthTab }: LoginFormProps) => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const VITE_API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(loginFormSchema) });

  const { login } = useAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      setIsLoading(true);
      await login(data);
      Snackbar.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      Snackbar.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect user to the backend, which then redirects to Google
    window.location.href = `${VITE_API_URL}/auth/google/login`;
  };

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4 lg:hidden">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">MeetingAI</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  defaultValue="test@1.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="********"
                  type="password"
                  {...register("password")}
                  defaultValue="12345"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                className={`w-full cursor-pointer hover:opacity-80 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                <p>Sign In</p>
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href=""
                  className="underline underline-offset-4 hover:text-primary"
                  onClick={() => setAuthTab("signup")}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
