"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, Shield, Star, Paintbrush, Hammer, Droplets, Lightbulb, Check } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { MarketingFilterCard } from "./MarketingFilterCard";

interface Service {
  id: number;
  name: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  slug?: string;
  services?: Service[];
}

export function MarketingFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Load initial state from search params
  const initialCategory = searchParams.get("category_id") || searchParams.get("category") || "";
  const initialServices = searchParams.getAll("service_ids[]").map(Number);
  const initialMinRating = searchParams.get("min_rating") ? Number(searchParams.get("min_rating")) : null;
  const initialMaxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : 50000;
  const initialOnlyVerified = searchParams.get("is_verified") === "1";
  const initialRadius = searchParams.get("radius") ? Number(searchParams.get("radius")) : 50;
  const initialInstantBook = searchParams.get("instant_book") === "1";
  const initialEqIncluded = searchParams.get("equipment_included") === "1";
  const initialSortOrder = searchParams.get("sort_by_price") || "";

  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedServices, setSelectedServices] = useState<number[]>(initialServices);
  const [minRating, setMinRating] = useState<number | null>(initialMinRating);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [onlyVerified, setOnlyVerified] = useState(initialOnlyVerified);
  const [radius, setRadius] = useState<number>(initialRadius);
  const [instantBook, setInstantBook] = useState(initialInstantBook);
  const [eqIncluded, setEqIncluded] = useState(initialEqIncluded);
  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Filter categories fetch failed", err);
      }
    };
    fetchCategories();
  }, []);

  // Sync state with URL search params changes
  useEffect(() => {
    setSelectedCategory(searchParams.get("category_id") || searchParams.get("category") || "");
    setSelectedServices(searchParams.getAll("service_ids[]").map(Number));
    setMinRating(searchParams.get("min_rating") ? Number(searchParams.get("min_rating")) : null);
    setMaxPrice(searchParams.get("max_price") ? Number(searchParams.get("max_price")) : 50000);
    setOnlyVerified(searchParams.get("is_verified") === "1");
    setRadius(searchParams.get("radius") ? Number(searchParams.get("radius")) : 50);
    setInstantBook(searchParams.get("instant_book") === "1");
    setEqIncluded(searchParams.get("equipment_included") === "1");
    setSortOrder(searchParams.get("sort_by_price") || "");
  }, [searchParams]);

  // Update URL query parameters on change
  const applyFilters = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Process updates
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "" || val === false) {
        params.delete(key);
      } else {
        params.set(key, val.toString());
      }
    });

    // Special handling for services array
    if (updates.service_ids !== undefined) {
      params.delete("service_ids[]");
      updates.service_ids.forEach((id: number) => {
        params.append("service_ids[]", id.toString());
      });
    }

    // Determine redirect target path
    let targetPath = "/providers";
    if (pathname.startsWith("/services")) {
      targetPath = "/services";
    }

    // If we are on a detail subpage (e.g. /services/[slug] or /providers/[id]), return to directory root
    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts.length > 1) {
      if (pathname.startsWith("/services")) {
        targetPath = "/services";
      } else {
        targetPath = "/providers";
      }
    }

    // Redirect or update path
    router.push(`${targetPath}?${params.toString()}`);
  };

  // Handler helpers
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    // Clear services when category changes
    setSelectedServices([]);
    applyFilters({
      category_id: catId,
      category: catId, // support both
      service_ids: [],
    });
  };

  const handleServiceToggle = (svcId: number) => {
    const nextServices = selectedServices.includes(svcId)
      ? selectedServices.filter(id => id !== svcId)
      : [...selectedServices, svcId];
    setSelectedServices(nextServices);
    applyFilters({ service_ids: nextServices });
  };

  // Get current services list to show
  const currentServices = categories.find(c => c.id.toString() === selectedCategory)?.services || [];

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedServices([]);
    setMinRating(null);
    setMaxPrice(50000);
    setOnlyVerified(false);
    setRadius(50);
    setInstantBook(false);
    setEqIncluded(false);
    setSortOrder("");

    router.push("/providers");
  };

  const activeCount = [
    selectedCategory ? 1 : 0,
    selectedServices.length > 0 ? 1 : 0,
    minRating ? 1 : 0,
    maxPrice < 50000 ? 1 : 0,
    onlyVerified ? 1 : 0,
    radius !== 50 ? 1 : 0,
    instantBook ? 1 : 0,
    eqIncluded ? 1 : 0,
    sortOrder ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <MarketingFilterCard
      title="Filter Ecosystem"
      variant="rounded"
      activeCount={activeCount}
      onReset={handleReset}
      showReset={activeCount > 0}
    >
      {/* Category Dropdown */}
      <div className="py-3">
        <label className="text-xs font-bold text-foreground block mb-1.5">Service Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full h-9 bg-card border border-border rounded-xl px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Services List */}
      {currentServices.length > 0 && (
        <div className="py-3 border-t border-border/40">
          <label className="text-xs font-bold text-foreground block mb-2">Filter by Services</label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 kuba-scroll">
            {currentServices.map((svc) => {
              const isChecked = selectedServices.includes(svc.id);
              return (
                <label key={svc.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleServiceToggle(svc.id)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className={cn(
                    "text-xs transition-colors",
                    isChecked ? "text-foreground font-bold" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {svc.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Default Sorting */}
      <div className="py-3 border-t border-border/40">
        <label className="text-xs font-bold text-foreground block mb-1.5">Sort Results</label>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            applyFilters({ sort_by_price: e.target.value });
          }}
          className="w-full h-9 bg-card border border-border rounded-xl px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Default Relevance</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Security & Verification segment */}
      <div className="py-3 border-t border-border/40">
        <span className="text-xs font-bold text-foreground block mb-2">Security & Verification</span>
        <div className="flex bg-muted/60 dark:bg-zinc-900 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => { setOnlyVerified(false); applyFilters({ is_verified: "" }); }}
            className={cn(
              "flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              !onlyVerified ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Any Type
          </button>
          <button
            type="button"
            onClick={() => { setOnlyVerified(true); applyFilters({ is_verified: "1" }); }}
            className={cn(
              "flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              onlyVerified ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Verified Only
          </button>
        </div>
      </div>

      {/* Price range with histogram */}
      <div className="py-3 border-t border-border/40">
        <span className="text-xs font-bold text-foreground block mb-1.5">Price range</span>
        <div className="flex items-end justify-between gap-[3px] h-8 px-1 mb-1.5">
          {[15, 25, 45, 30, 20, 35, 55, 70, 85, 90, 60, 40, 50, 65, 30, 20, 15, 10, 5, 2].map((height, i) => (
            <div
              key={i}
              style={{ height: `${height}%` }}
              className={cn(
                "flex-1 rounded-t-sm transition-colors",
                (i / 20) * 50000 <= maxPrice
                  ? "bg-primary/70 dark:bg-primary/50"
                  : "bg-muted dark:bg-zinc-800"
              )}
            />
          ))}
        </div>
        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          value={maxPrice}
          onChange={(e) => {
            const val = Number(e.target.value);
            setMaxPrice(val);
            applyFilters({ max_price: val });
          }}
          className="w-full accent-primary h-1 bg-muted dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer mb-2.5"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1 p-1.5 rounded-lg border border-border bg-card">
            <span className="text-[8px] text-muted-foreground block font-bold uppercase tracking-wider">Minimum</span>
            <span className="text-[11px] font-bold text-foreground block mt-0.5">KES 500</span>
          </div>
          <div className="flex-1 p-1.5 rounded-lg border border-border bg-card">
            <span className="text-[8px] text-muted-foreground block font-bold uppercase tracking-wider">Maximum</span>
            <span className="text-[11px] font-bold text-foreground block mt-0.5">KES {maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating & Distance */}
      <div className="py-3 border-t border-border/40 space-y-3">
        <span className="text-xs font-bold text-foreground block">Rating & Distance</span>
        
        {/* Rating circular buttons */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground font-semibold">Min Rating</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Any", value: null },
              { label: "1+", value: 1 },
              { label: "2+", value: 2 },
              { label: "3+", value: 3 },
              { label: "4+", value: 4 },
              { label: "5", value: 5 },
            ].map((opt) => {
              const active = minRating === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    setMinRating(opt.value);
                    applyFilters({ min_rating: opt.value || "" });
                  }}
                  className={cn(
                    "flex items-center justify-center font-bold text-xs transition-all cursor-pointer w-8 h-8 rounded-full",
                    opt.value === null && "px-3 w-auto",
                    active
                      ? "bg-foreground text-background font-black border border-foreground"
                      : "bg-card text-foreground border border-border hover:border-muted-foreground/60"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Radius circular buttons */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground font-semibold">Service Radius (km)</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Any", value: 1000 },
              { label: "5", value: 5 },
              { label: "10", value: 10 },
              { label: "25", value: 25 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ].map((opt) => {
              const active = radius === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    setRadius(opt.value);
                    applyFilters({ radius: opt.value === 1000 ? "" : opt.value });
                  }}
                  className={cn(
                    "flex items-center justify-center font-bold text-xs transition-all cursor-pointer w-8 h-8 rounded-full",
                    opt.value === 1000 && "px-3 w-auto",
                    active
                      ? "bg-foreground text-background font-black border border-foreground"
                      : "bg-card text-foreground border border-border hover:border-muted-foreground/60"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Options switches */}
      <div className="py-3 border-t border-border/40 space-y-2">
        <span className="text-xs font-bold text-foreground block">Booking Options</span>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between py-0.5">
            <span className="text-xs font-semibold text-foreground">Instant Book</span>
            <button
              type="button"
              onClick={() => {
                const next = !instantBook;
                setInstantBook(next);
                applyFilters({ instant_book: next ? "1" : "" });
              }}
              className={cn(
                "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative flex items-center",
                instantBook ? "bg-primary" : "bg-muted dark:bg-zinc-800"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                instantBook ? "translate-x-4" : "translate-x-0"
              )} />
            </button>
          </div>
          <div className="flex items-center justify-between py-0.5">
            <span className="text-xs font-semibold text-foreground">Equipment Included</span>
            <button
              type="button"
              onClick={() => {
                const next = !eqIncluded;
                setEqIncluded(next);
                applyFilters({ equipment_included: next ? "1" : "" });
              }}
              className={cn(
                "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative flex items-center",
                eqIncluded ? "bg-primary" : "bg-muted dark:bg-zinc-800"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                eqIncluded ? "translate-x-4" : "translate-x-0"
              )} />
            </button>
          </div>
        </div>
      </div>
    </MarketingFilterCard>
  );
}
