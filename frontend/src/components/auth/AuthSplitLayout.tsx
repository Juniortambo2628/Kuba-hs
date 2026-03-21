"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  visualContent: React.ReactNode;
  visualBgClass?: string;
  theme?: 'blue' | 'emerald' | 'indigo';
}

export function AuthSplitLayout({ 
  children, 
  visualContent, 
  visualBgClass = "bg-primary",
  theme = 'blue'
}: AuthSplitLayoutProps) {
  
  const returnHomeColors = {
    blue: "hover:text-primary",
    emerald: "hover:text-emerald-600",
    indigo: "hover:text-indigo-600",
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 overflow-y-auto relative">
        <div className="w-full max-w-sm space-y-8 py-12">
          <Link 
            href="/" 
            className={cn(
              "absolute top-8 left-8 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground transition-colors",
              returnHomeColors[theme]
            )}
          >
            <ChevronLeft className="w-4 h-4" /> Return to Home
          </Link>
          
          {children}
        </div>
      </div>

      {/* Visual Column */}
      <div className={cn(
        "hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-end p-16",
        visualBgClass
      )}>
        {/* Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        {visualContent}
      </div>
    </div>
  );
}
