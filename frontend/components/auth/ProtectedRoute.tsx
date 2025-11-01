"use client";

import { useEffect, useRef } from "react";
import { useVerifyAuth } from "@/hooks/useVerifyAuth";
import { Snackbar } from "../common/Snackbar";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function FullPageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {/* You can replace this with a more sophisticated spinner component */}
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isVerified, error } = useVerifyAuth();
  const router = useRouter();
  const errorShownRef = useRef(false);

  useEffect(() => {
    if (error && !errorShownRef.current) {
      Snackbar.error(error);
      errorShownRef.current = true; // Mark as shown
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);

      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return isVerified ? <>{children}</> : null;
}
