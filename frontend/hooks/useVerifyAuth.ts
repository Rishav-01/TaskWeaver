"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export function useVerifyAuth() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/"); // Use replace to avoid adding to history
        return;
      }

      try {
        const userObject = await authService.verifyToken(token);
        setIsVerified(true);
        localStorage.setItem("user", JSON.stringify(userObject));
      } catch (error) {
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isLoading, isVerified };
}
