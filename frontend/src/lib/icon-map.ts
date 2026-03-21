import {
  Trophy, Gem, Shield, ShieldCheck, Zap, Activity, Globe, Users, Heart, PieChart,
  Building2, BarChart3, Presentation, BookOpen, Leaf, TrendingUp, Rocket,
  Scale, Share2, CheckCircle2, Wrench, Sparkles, Droplet, Car, Home, Briefcase,
  type LucideIcon,
} from "lucide-react";

/**
 * Canonical icon registry mapping string keys from the CMS database
 * to their corresponding Lucide React components.
 */
const iconMap: Record<string, LucideIcon> = {
  // General
  Trophy,
  Gem,
  Shield,
  ShieldCheck,
  Zap,
  Activity,
  Globe,
  Users,
  Heart,
  PieChart,
  Building2,
  BarChart3,
  Presentation,
  BookOpen,
  Leaf,
  TrendingUp,
  Rocket,
  Scale,
  Share2,
  CheckCircle2,

  // Service category icons (lowercase keys used in categories)
  wrench: Wrench,
  sparkles: Sparkles,
  droplet: Droplet,
  bolt: Zap,
  car: Car,
  home: Home,
  heart: Heart,
  briefcase: Briefcase,
  building: Building2,
};

/**
 * Resolve a Lucide icon component from a string key stored in the database.
 * Falls back to a provided default or `Shield` if no match is found.
 */
export function resolveIcon(name: string | null | undefined, fallback: LucideIcon = Shield): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] ?? fallback;
}

export { iconMap };
