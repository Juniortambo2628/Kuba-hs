"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { serviceDetailHref } from "@/lib/service-urls";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axios";
import {
  ArrowRight,
  Sparkles,
  Wrench,
  Droplet,
  Zap,
  Home,
  Briefcase,
  Building2,
  Heart,
  Car,
} from "lucide-react";
import { navUi } from "@/lib/nav-ui";
import { cn } from "@/lib/utils";

interface MegamenuService {
  id: string;
  name: string;
  slug?: string;
  description?: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  type?: string;
  description?: string;
  services: MegamenuService[];
  icon: string | null;
}

const iconMap: Record<string, React.ReactNode> = {
  wrench: <Wrench className="h-4 w-4" />,
  sparkles: <Sparkles className="h-4 w-4" />,
  droplet: <Droplet className="h-4 w-4" />,
  bolt: <Zap className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  heart: <Heart className="h-4 w-4" />,
  briefcase: <Briefcase className="h-4 w-4" />,
  building: <Building2 className="h-4 w-4" />,
  building2: <Building2 className="h-4 w-4" />,
};

function dedupeServices(services: MegamenuService[]): MegamenuService[] {
  const seen = new Set<string>();
  return services.filter((service) => {
    const key = (service.slug || service.name).trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

interface ServiceMegamenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function CategoryRow({
  category,
  onClose,
  active,
}: {
  category: Category;
  onClose: () => void;
  active?: boolean;
}) {
  const iconKey = (category.icon || "").toLowerCase();
  const preview = dedupeServices(category.services ?? [])[0];

  return (
    <Link
      href={`/services?category=${category.slug}`}
      onClick={onClose}
      className={cn(navUi.megamenuItem, active && navUi.megamenuItemActive)}
    >
      <span className={navUi.megamenuIcon}>
        {iconKey && iconMap[iconKey] ? iconMap[iconKey] : <Sparkles className="h-4 w-4" />}
      </span>
      <span className="min-w-0">
        <span className={navUi.megamenuTitle}>{category.name}</span>
        <span className={navUi.megamenuDesc}>
          {category.description?.slice(0, 72) ||
            (preview
              ? `${preview.name} and more`
              : `Browse ${category.name.toLowerCase()} services`)}
        </span>
      </span>
    </Link>
  );
}

export function ServiceMegamenu({ isOpen, onClose }: ServiceMegamenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        setCategories(response.data.data ?? []);
      } catch (error) {
        console.error("Failed to fetch categories for megamenu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen, categories.length]);

  const { residential, commercial, featured } = useMemo(() => {
    const res: Category[] = [];
    const com: Category[] = [];
    for (const cat of categories) {
      if (cat.type === "commercial") com.push(cat);
      else res.push(cat);
    }
    return {
      residential: res,
      commercial: com,
      featured: res.slice(0, 5),
    };
  }, [categories]);

  const activeCategory =
    categories.find((c) => c.id === hoveredId) ?? featured[0] ?? categories[0];

  const quickLinks = useMemo(() => {
    const links: { label: string; href: string }[] = [
      { label: "All services", href: "/services" },
      { label: "Find providers", href: "/providers" },
      { label: "Browse categories", href: "/categories" },
    ];
    if (activeCategory) {
      dedupeServices(activeCategory.services ?? [])
        .slice(0, 5)
        .forEach((s) => {
          links.push({
            label: s.name,
            href: serviceDetailHref({ ...s, category_slug: activeCategory.slug }),
          });
        });
    }
    return links;
  }, [activeCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={navUi.megamenuWrap}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className={navUi.megamenuPanel}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 animate-pulse">
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-xl bg-muted/60" />
                  ))}
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-9 rounded-lg bg-muted/40" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 md:gap-10">
                <div>
                  <p className={navUi.megamenuSectionLabel}>Browse services</p>
                  <div className="space-y-0.5">
                    {featured.map((cat) => (
                      <div
                        key={cat.id}
                        onMouseEnter={() => setHoveredId(cat.id)}
                      >
                        <CategoryRow
                          category={cat}
                          onClose={onClose}
                          active={hoveredId === cat.id || (!hoveredId && cat.id === featured[0]?.id)}
                        />
                      </div>
                    ))}
                  </div>
                  {commercial.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/40">
                      <p className={navUi.megamenuSectionLabel}>For business</p>
                      <div className="space-y-0.5">
                        {commercial.slice(0, 3).map((cat) => (
                          <div key={cat.id} onMouseEnter={() => setHoveredId(cat.id)}>
                            <CategoryRow category={cat} onClose={onClose} active={hoveredId === cat.id} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:border-l md:border-border/40 md:pl-8">
                  <p className={navUi.megamenuSectionLabel}>
                    {activeCategory ? activeCategory.name : "Quick links"}
                  </p>
                  <nav className="space-y-0.5">
                    {quickLinks.map((link, i) => (
                      <Link
                        key={`${link.href}-${i}`}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          navUi.megamenuSideLink,
                          i === 0 && navUi.megamenuSideLinkActive
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-8 pt-6 border-t border-border/40">
                    <p className={navUi.megamenuSectionLabel}>Solutions</p>
                    <div className="space-y-0.5">
                      <Link href="/providers" onClick={onClose} className={navUi.megamenuSideLink}>
                        Find providers
                      </Link>
                      <Link href="/commercial" onClick={onClose} className={navUi.megamenuSideLink}>
                        Commercial services
                      </Link>
                      <Link href="/cooperatives" onClick={onClose} className={navUi.megamenuSideLink}>
                        Cooperatives
                      </Link>
                      <Link href="/investors" onClick={onClose} className={navUi.megamenuSideLink}>
                        Investors
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/services"
                    onClick={onClose}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    View all services on Kuba
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
