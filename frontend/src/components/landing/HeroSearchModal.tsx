"use client";

import { useState, useEffect } from "react";
import { 
  Search, MapPin, X, ArrowRight, 
  Map as MapIcon, Star, Clock, 
  ChevronRight, Sparkles, Filter 
} from "lucide-react";
import { 
  Dialog, DialogContent, 
  DialogHeader, DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface ProviderResult {
  id: number;
  business_name: string;
  location_name: string;
  rating: number;
  review_count: number;
  logo?: string;
  services?: any[];
}

interface HeroSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "service" | "location";
}

export function HeroSearchModal({ isOpen, onClose, initialTab }: HeroSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<ProviderResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"service" | "location">("service");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      // Reset search when opening
      setSearchTerm("");
      setLocationTerm("");
      setResults([]);
      setSelectedCategory(null);
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2 || locationTerm.length >= 2 || selectedCategory) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, locationTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/api/categories');
      setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (locationTerm) params.append('location', locationTerm);
      if (selectedCategory) params.append('category_id', selectedCategory.toString());
      
      const { data } = await axiosInstance.get(`/api/search?${params.toString()}`);
      setResults(data.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const getLogoUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${url}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white dark:bg-[#0B0F19] border-border rounded-[2.5rem] shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-heading-md flex items-center gap-3">
             Find <span className="text-primary">Professionals</span>
             <Badge variant="outline" className="text-label-caps rounded-full px-3 py-1 border-primary/20 text-primary bg-primary/5">
                Marketplace Search
             </Badge>
          </DialogTitle>
          <DialogDescription className="text-body-pro text-sm">
             Search through hundreds of verified experts and local service providers.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 pt-2 space-y-8">
          {/* Search Tabs */}
          <div className="flex p-1 bg-muted/50 dark:bg-white/5 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab("service")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "service" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
            >
              Search Service
            </button>
            <button 
              onClick={() => setActiveTab("location")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "location" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
            >
              Search Location
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className={`absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500`} />
            <div className="relative flex items-center bg-muted/50 dark:bg-white/5 rounded-2xl px-6 h-16 border border-border group-focus-within:border-primary/50 transition-all">
              {activeTab === "service" ? (
                <>
                  <Search className="text-primary w-5 h-5 mr-4" />
                  <Input 
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="What service are you looking for?"
                    className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 px-0 h-10 font-semibold text-lg"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="ml-2 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <MapPin className="text-primary w-5 h-5 mr-4" />
                  <Input 
                    autoFocus
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    placeholder="Enter city or neighborhood in Kenya..."
                    className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 px-0 h-10 font-semibold text-lg"
                  />
                  {locationTerm && (
                    <button onClick={() => setLocationTerm("")} className="ml-2 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h4 className="text-label-caps flex items-center gap-2">
                 <Filter className="w-3 h-3" /> Quick Filter By Category
               </h4>
               {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-label-caps text-primary hover:underline transition-all"
                  >
                    Clear Filter
                  </button>
               )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`px-4 py-2 rounded-xl text-label-caps lowercase transition-all border ${
                    selectedCategory === cat.id 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                    : "bg-muted/50 dark:bg-white/5 text-muted-foreground hover:bg-muted dark:hover:bg-white/10 border-border"
                  }`}
                >
                  <span className="capitalize">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="space-y-4">
            <h4 className="text-label-caps">
              {isSearching ? "Searching..." : results.length > 0 ? `Matched Results (${results.length})` : searchTerm.length >= 2 ? "No results found" : "Top Rated Pros Near You"}
            </h4>
            
            <ScrollArea className="h-[300px] -mx-8 px-8">
              <div className="space-y-3 pb-4">
                {results.length > 0 ? (
                  results.map((result, idx) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Link 
                        href={`/providers/${result.id}`}
                        onClick={onClose}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/30 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 border border-transparent hover:border-border transition-all"
                      >
                        <div className="w-14 h-14 rounded-xl bg-muted border border-border overflow-hidden shrink-0">
                           {result.services?.[0]?.service_thumbnail_url ? (
                             <img src={result.services[0].service_thumbnail_url} alt={result.business_name} className="w-full h-full object-cover" />
                           ) : result.logo ? (
                             <img src={getLogoUrl(result.logo) || ""} alt={result.business_name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center font-bold text-lg text-muted-foreground/30">
                               {result.business_name.substring(0, 2)}
                             </div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-foreground text-base truncate group-hover:text-primary transition-colors">
                            {result.business_name}
                          </h5>
                          <div className="flex items-center gap-3 mt-0.5">
                             <span className="text-label-caps flex items-center gap-1 text-amber-500">
                               <Star className="w-3 h-3 fill-current" /> {result.rating || 'New'}
                             </span>
                             <span className="w-1 h-1 rounded-full bg-border" />
                             <span className="text-label-caps flex items-center gap-1">
                               <MapPin className="w-3 h-3" /> {result.location_name || 'Nairobi, KE'}
                             </span>
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary transition-all group-hover:text-primary-foreground">
                           <ChevronRight className="w-5 h-5" />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : searchTerm.length < 2 && !selectedCategory ? (
                   <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                      <Sparkles className="w-10 h-10 mb-4" />
                      <p className="text-xs font-bold tracking-[0.2em]">Enter 2+ characters to match</p>
                   </div>
                ) : !isSearching && (
                   <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 opacity-50">
                        <X className="w-8 h-8" />
                      </div>
                      <h5 className="font-bold text-foreground mb-1">No services discovered</h5>
                      <p className="text-sm text-muted-foreground">Adjust your filters or try a broader search term.</p>
                   </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-muted/30 dark:bg-white/5 border-t border-border flex items-center justify-between">
           <p className="text-[9px] font-bold text-muted-foreground tracking-tight">
             Press <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border inline-block">ESC</kbd> to exit
           </p>
            <Link href="/providers" onClick={onClose} className="text-label-caps text-primary flex items-center gap-2 group">
              Visit Full Directory <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
