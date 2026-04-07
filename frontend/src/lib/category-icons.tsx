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
  Smartphone,
  Stethoscope,
  GraduationCap,
  Scale,
  Utensils,
  Truck,
  Plug,
  Droplets,
  BookOpen,
  Scissors
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
  medical: <Stethoscope className="w-5 h-5" />,
  education: <GraduationCap className="w-5 h-5" />,
  legal: <Scale className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  logistics: <Truck className="w-5 h-5" />,
  electrical: <Plug className="w-5 h-5" />,
  plumbing: <Droplets className="w-5 h-5" />,
  personal: <Scissors className="w-5 h-5" />,
};

const nameToIconMap: Record<string, string> = {
  'cleaning': 'sparkles',
  'maintenance': 'wrench',
  'health': 'medical',
  'wellness': 'heart',
  'education': 'education',
  'training': 'education',
  'financial': 'building',
  'legal': 'legal',
  'food': 'food',
  'hospitality': 'home',
  'logistics': 'logistics',
  'plumbing': 'plumbing',
  'electrical': 'electrical',
  'home': 'home',
  'personal': 'personal',
  'beauty': 'sparkles',
  'auto': 'car',
  'tech': 'cpu'
};

/**
 * Helper to get an icon by its identifier string.
 * Falls back to a default "wrench" icon if not found.
 */
export function getCategoryIcon(iconKey: string | null | undefined, className: string = "w-5 h-5", categoryName?: string) {
  let matchedIconKey = iconKey;

  // If no DB icon is provided and we have a category name, try to heuristically match it
  if (!matchedIconKey && categoryName) {
    const lowerName = categoryName.toLowerCase();
    for (const [key, iconName] of Object.entries(nameToIconMap)) {
      if (lowerName.includes(key)) {
        matchedIconKey = iconName;
        break;
      }
    }
  }

  const icon = matchedIconKey && iconMap[matchedIconKey] ? iconMap[matchedIconKey] : iconMap.wrench;
  
  // Clone element to apply custom className if provided
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement<any>, { className });
  }
  
  return icon;
}
