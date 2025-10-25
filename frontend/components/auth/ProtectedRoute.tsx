"use client";

import { useVerifyAuth } from "@/hooks/useVerifyAuth";

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
  const { isLoading, isVerified } = useVerifyAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  return isVerified ? <>{children}</> : null;
}
