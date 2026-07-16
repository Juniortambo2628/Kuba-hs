"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Briefcase } from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAccountDropdown } from "@/components/shared/UserAccountDropdown";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { NotificationBadge } from "@/components/shared/NotificationBadge";
import { ServiceMegamenu } from "./ServiceMegamenu";
import { uiPrimitives } from "@/lib/ui-primitives";
import { navUi } from "@/lib/nav-ui";
import { cn } from "@/lib/utils";

const MOBILE_SOLUTION_LINKS = [
  { label: "Find providers", href: "/providers" },
  { label: "Commercial", href: "/commercial" },
  { label: "Cooperatives", href: "/cooperatives" },
  { label: "Investors", href: "/investors" },
];

const HIDDEN_NAV_LABELS = new Set([
  "investors",
  "commercial",
  "cooperatives",
  "solutions",
  "providers",
]);

type NavItem = { id: string; label: string; url: string };

function NavLink({
  href,
  label,
  active,
  onMouseEnter,
}: {
  href: string;
  label: string;
  active?: boolean;
  onMouseEnter?: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      className={cn(navUi.link, active && navUi.linkActive)}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const { getS, getImg } = useCMS();
  const { user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: "nav_1", label: "Services", url: "/services" },
    { id: "nav_3", label: "About", url: "/about" },
    { id: "nav_4", label: "Journal", url: "/blog" },
    { id: "nav_5", label: "Contact", url: "/contact" },
  ]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const navString = getS("identity", "navigation_menu", "");
    if (navString) {
      try {
        const parsed = JSON.parse(navString) as NavItem[];
        setNavItems(parsed);
      } catch {
        /* keep defaults */
      }
    }
  }, [getS]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoLight = getImg(
    "identity",
    "logo_light",
    "/assets/Kuba-Header-footter-Logo-for-Light-Mode.png"
  );
  const logoDark = getImg(
    "identity",
    "logo_dark",
    "/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png"
  );

  const BrandLogo = () => (
    <>
      <div className={cn(navUi.brand, "dark:hidden")}>
        <Image src={logoLight} alt="Kuba" fill sizes="240px" className="object-contain object-left" priority />
      </div>
      <div className={cn(navUi.brand, "hidden dark:block")}>
        <Image src={logoDark} alt="Kuba" fill sizes="240px" className="object-contain object-left" priority />
      </div>
    </>
  );

  if (!mounted) {
    return (
      <nav className={cn(navUi.bar, "sticky top-0 z-[100] h-16")}>
        <div className={cn(uiPrimitives.layout.nav, "h-full flex items-center")}>
          <Link href="/" className="inline-flex shrink-0">
            <BrandLogo />
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn(navUi.bar, "sticky top-0 z-[100]", scrolled && navUi.barScrolled)}
      onMouseLeave={() => setIsMegamenuOpen(false)}
    >
      <div className={uiPrimitives.layout.nav}>
        <div className={navUi.inner}>
          <Link href="/" className="inline-flex shrink-0 items-center">
            <BrandLogo />
            <span className="sr-only">Kuba</span>
          </Link>

          <div className={navUi.navCluster}>
            <NavLink href="/" label="Home" active={pathname === "/"} />

            {navItems.map((item) => {
              const labelLower = item.label.toLowerCase();
              if (HIDDEN_NAV_LABELS.has(labelLower)) return null;

              const isServices = labelLower === "services";
              const isActive = pathname === item.url || (isServices && isMegamenuOpen);

              if (isServices) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setIsMegamenuOpen(true)}
                  >
                    <Link
                      href={item.url}
                      className={cn(navUi.link, "inline-flex items-center gap-1", isActive && navUi.linkActive)}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.id}
                  href={item.url}
                  label={item.label}
                  active={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                />
              );
            })}
          </div>

          <div className={navUi.actions}>
            <GlobalSearch />
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-1">
                <NotificationBadge />
                <UserAccountDropdown variant="navbar" />
              </div>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={cn(navUi.signIn, "cursor-pointer")}>
                      Sign in
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 rounded-2xl border-border/60 shadow-xl p-2"
                  >
                    <DropdownMenuLabel className="text-sm font-bold text-primary px-2 py-1">
                      Sign in
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                      <Link href="/login?role=client" className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        Customer
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                      <Link href="/login/provider" className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        Professional
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button asChild className={navUi.cta}>
                  <Link href="/register/provider">Join as a pro</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1">
            {user && <NotificationBadge />}
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-foreground hover:bg-muted"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[400px] bg-background border-l border-border p-0"
              >
                <div className="flex flex-col h-full">
                  <div className="px-6 pt-8 pb-4 border-b border-border/40">
                    <Link href="/" className="inline-flex">
                      <div className={cn(navUi.brand, "dark:hidden")}>
                        <Image src={logoLight} alt="Kuba" fill sizes="160px" className="object-contain object-left" />
                      </div>
                      <div className={cn(navUi.brand, "hidden dark:block")}>
                        <Image src={logoDark} alt="Kuba" fill sizes="160px" className="object-contain object-left" />
                      </div>
                    </Link>
                  </div>

                  <div className="flex-1 overflow-y-auto kuba-scroll px-4 py-6 space-y-1">
                    <p className={cn(uiPrimitives.label.sectionHeading, "px-3")}>Menu</p>
                    <Link
                      href="/"
                      className={cn(
                        "flex items-center px-4 py-3 rounded-full text-sm font-medium transition-colors",
                        pathname === "/"
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      Home
                    </Link>
                    {navItems
                      .filter((item) => !HIDDEN_NAV_LABELS.has(item.label.toLowerCase()))
                      .map((item) => {
                        const isActive = pathname === item.url;
                        return (
                          <Link
                            key={item.id}
                            href={item.url}
                            className={cn(
                              "flex items-center px-4 py-3 rounded-full text-sm font-medium transition-colors",
                              isActive
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted/60"
                            )}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    <p className={cn(uiPrimitives.label.sectionHeading, "px-3 mt-6")}>Solutions</p>
                    {MOBILE_SOLUTION_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center px-4 py-3 rounded-full text-sm font-medium text-muted-foreground hover:bg-muted/60"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="px-6 py-6 border-t border-border/40 space-y-3">
                    {!user && (
                      <>
                        <Button asChild variant="outline" className="w-full rounded-full h-11 font-semibold">
                          <Link href="/login?role=client">Sign in</Link>
                        </Button>
                        <Button asChild className={cn(navUi.cta, "w-full h-11")}>
                          <Link href="/register/provider">Join as a pro</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div onMouseEnter={() => setIsMegamenuOpen(true)}>
        <ServiceMegamenu isOpen={isMegamenuOpen} onClose={() => setIsMegamenuOpen(false)} />
      </div>
    </nav>
  );
}
