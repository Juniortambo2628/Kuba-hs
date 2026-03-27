import React from "react";
import { 
  Car, 
  Home, 
  Heart, 
  Briefcase, 
  Building2, 
  Sparkles, 
  Droplet, 
  Zap, 
  Wrench,
  Hammer,
  Shield,
  Palette,
  Lightbulb,
  Cpu,
  Smartphone
} from "lucide-react";

/**
 * Shared icon mapping for service categories.
 * Provides a single source of truth for all category-related icon usage.
 */
export const iconMap: Record<string, React.ReactNode> = {
  car: <Car className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  building: <Building2 className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  droplet: <Droplet className="w-5 h-5" />,
  bolt: <Zap className="w-5 h-5" />,
  wrench: <Wrench className="w-5 h-5" />,
  hammer: <Hammer className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  palette: <Palette className="w-5 h-5" />,
  lightbulb: <Lightbulb className="w-5 h-5" />,
  cpu: <Cpu className="w-5 h-5" />,
  smartphone: <Smartphone className="w-5 h-5" />,
};

/**
 * Helper to get an icon by its identifier string.
 * Falls back to a default "wrench" icon if not found.
 */
export function getCategoryIcon(iconKey: string | null | undefined, className: string = "w-5 h-5") {
  const icon = iconKey && iconMap[iconKey] ? iconMap[iconKey] : iconMap.wrench;
  
  // Clone element to apply custom className if provided
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement<any>, { className });
  }
  
  return icon;
}
