"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeroBookingBarProps {
  serviceLabel: string;
  locationLabel: string;
  dateLabel: string;
  onServiceClick: () => void;
  onLocationClick: () => void;
  servicePlaceholder?: string;
  locationPlaceholder?: string;
  className?: string;
}

export function HeroBookingBar({
  serviceLabel,
  locationLabel,
  dateLabel,
  onServiceClick,
  onLocationClick,
  servicePlaceholder = "Cleaning, plumbing, electrical…",
  locationPlaceholder = "Enter your area…",
  className,
}: HeroBookingBarProps) {
  const router = useRouter();
  const [dateValue, setDateValue] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (dateValue) params.set("date", dateValue);
    const q = params.toString();
    router.push(q ? `/services?${q}` : "/services");
  };

  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto bg-background rounded-2xl md:rounded-3xl shadow-xl shadow-black/10 border border-border/60",
        "flex flex-col md:flex-row md:items-stretch divide-y md:divide-y-0 md:divide-x divide-border/60",
        className
      )}
    >
      <button
        type="button"
        onClick={onServiceClick}
        className="flex-1 flex items-start gap-3 p-4 md:p-5 text-left hover:bg-muted/40 transition-colors rounded-t-2xl md:rounded-t-none md:rounded-l-3xl"
      >
        <Search className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{serviceLabel}</p>
          <p className="text-sm text-muted-foreground border-b border-border/80 pb-0.5 mt-1 truncate">
            {servicePlaceholder}
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
      </button>

      <button
        type="button"
        onClick={onLocationClick}
        className="flex-1 flex items-start gap-3 p-4 md:p-5 text-left hover:bg-muted/40 transition-colors"
      >
        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{locationLabel}</p>
          <p className="text-sm text-muted-foreground border-b border-border/80 pb-0.5 mt-1 truncate">
            {locationPlaceholder}
          </p>
        </div>
      </button>

      <div className="flex-1 flex items-center gap-3 p-4 md:p-5 min-w-0">
        <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{dateLabel}</p>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className="w-full text-sm text-muted-foreground bg-transparent border-b border-border/80 pb-0.5 mt-1 outline-none focus:border-primary"
            aria-label="Preferred service date"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSearch}
        className="m-2 md:m-2 md:ml-0 h-14 w-full md:h-auto md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="Search services"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
