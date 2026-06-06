"use client";

import { ArrowRight, MessageSquare, Shield, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AppButton } from "@/components/shared/ui";
import { getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import { providerHref } from "@/lib/provider-urls";

interface BookingProvider {
  id?: string;
  slug?: string;
  business_name?: string;
  logo?: string | null;
  user?: { avatar_url?: string | null };
  rating?: number | null;
  review_count?: number;
  is_verified?: boolean;
}

interface MarketingBookingSidebarProps {
  price: number;
  pricingType?: string;
  provider: BookingProvider | null;
  onBook: () => void;
}

function formatPricingLabel(type?: string): string {
  if (type === "hourly") return "hour";
  if (type === "per_sqft") return "sq ft";
  return "service";
}

export function MarketingBookingSidebar({
  price,
  pricingType = "service",
  provider,
  onBook,
}: MarketingBookingSidebarProps) {
  const unit = formatPricingLabel(pricingType);

  return (
    <Card className="rounded-2xl border border-border/50 shadow-lg overflow-hidden bg-card">
      <div className="px-6 py-5 border-b border-border/40 bg-muted/40">
        <p className="text-sm font-medium text-muted-foreground mb-1">Estimated price</p>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
            KES {Number(price || 0).toLocaleString()}
          </span>
          <span className="text-sm font-medium text-muted-foreground">per {unit}</span>
        </div>
      </div>

      <CardContent className="p-6 space-y-5">
        {provider && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Featured professional</p>
            <Link
              href={providerHref(provider)}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/40 hover:border-primary/30 transition-colors"
            >
              <Avatar className="h-12 w-12 border border-border/60 shadow-sm">
                <AvatarImage
                  src={getMediaUrl(provider.logo || provider.user?.avatar_url, "avatar")}
                />
                <AvatarFallback className="font-semibold text-sm">
                  {provider.business_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{provider.business_name}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <span>{provider.rating ?? "4.9"}</span>
                  <span className="text-muted-foreground/80">
                    · {provider.review_count ?? 0} reviews
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="space-y-2.5">
          <AppButton tone="primary" scale="lg" className="w-full" onClick={onBook}>
            Book this pro
            <ArrowRight className="w-4 h-4 ml-2" />
          </AppButton>
          <AppButton tone="outline" scale="md" className="w-full" disabled>
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat with pro
          </AppButton>
        </div>

        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/40">
          <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
          Secure marketplace protection
        </p>
      </CardContent>
    </Card>
  );
}
