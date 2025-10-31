"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/authService";

export function useVerifyAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        localStorage.clear();
        setError("Session expired. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  return { isLoading, isVerified, error };
}
