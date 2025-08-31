import { BarChart3, Bot, Shield, Users, Zap } from "lucide-react";
import React from "react";

const BrandingComponent = () => {
  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/10" />
      <div className="relative z-20 text-black flex items-center text-lg font-medium">
        <Bot className="mr-2 h-6 w-6" />
        TaskWeaver
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            Transform your meetings with AI-powered transcript analysis and
            automatic action item extraction.
          </p>
        </blockquote>
        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm">AI-powered transcript analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Smart participant management</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Comprehensive reporting</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingComponent;
