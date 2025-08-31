"use client";

import SignUpForm from "@/components/auth/signup";
import LoginForm from "@/components/auth/login";
import { useState } from "react";
import BrandingComponent from "@/components/layout/branding";

export default function LoginPage() {
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container relative flex min-h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Branding and features */}
        <BrandingComponent />

        {/* Right side - Login form */}
        {authTab === "login" ? (
          <LoginForm setAuthTab={setAuthTab} />
        ) : (
          <SignUpForm setAuthTab={setAuthTab} />
        )}
      </div>
    </div>
  );
}
