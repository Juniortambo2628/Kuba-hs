"use client";

import Image from "next/image";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { AuthPageContent } from "@/lib/auth-page-content";
import { authUi } from "@/lib/auth-ui";
import { cn } from "@/lib/utils";

interface AuthVisualPanelProps {
  visual: AuthPageContent["visual"];
  accent: "client" | "provider";
}

export function AuthVisualPanel({ visual, accent }: AuthVisualPanelProps) {
  return (
    <div
      className={cn(
        authUi.visualCol,
        accent === "provider" ? authUi.visualProvider : authUi.visualClient
      )}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
      </div>

      {visual.imageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={visual.imageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover opacity-40 mix-blend-overlay"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
          <div className="w-full max-w-sm aspect-square rounded-[2rem] bg-white/15 backdrop-blur-sm border border-white/20 shadow-2xl rotate-6 translate-y-8" />
          <div className="absolute w-full max-w-[280px] aspect-[4/3] rounded-3xl bg-white/10 border border-white/15 -rotate-3 -translate-x-8" />
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
        <h2 className={authUi.visualHeadline}>{visual.headline}</h2>

        <div className={authUi.visualPanel}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <span className="flex -space-x-1">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                <span className="h-2 w-2 rounded-full bg-white/80" />
              </span>
              {visual.status}
            </span>
            <div className="flex gap-2">
              <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <ArrowDownLeft className="h-3.5 w-3.5" />
              </span>
              <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
          <p className="text-xs text-white/85 leading-relaxed">{visual.caption}</p>
        </div>
      </div>
    </div>
  );
}
