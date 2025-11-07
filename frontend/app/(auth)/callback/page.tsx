"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Snackbar } from "@/components/common/Snackbar";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectRan = useRef(false);

  useEffect(() => {
    // Prevent the effect from running twice in development with React.StrictMode
    if (effectRan.current) return;
    effectRan.current = true;

    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      Snackbar.success("Logged in successfully!");
      router.push("/dashboard");
    } else {
      Snackbar.error("Login failed. No token received.");
      router.push("/");
    }
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}
