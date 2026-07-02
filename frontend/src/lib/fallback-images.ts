/**
 * Centralized fallback image URLs.
 * Replace hardcoded Unsplash URLs scattered across components.
 */

export const FALLBACK_IMAGES = {
  /** Hero carousel — house exterior */
  hero1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  /** Hero carousel — house interior */
  hero2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2058&auto=format&fit=crop",
  /** Hero carousel — house pool */
  hero3: "https://images.unsplash.com/photo-1600566753190-17f0baa42a6a?q=80&w=2070&auto=format&fit=crop",

  /** Cleaning supplies / general service */
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
  /** Team meeting / collaboration */
  team: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
  /** Customer service / support */
  support: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop",

  /** Testimonial avatar — woman headshot */
  testimonialAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  /** Generic testimonial fallback */
  testimonial: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=200&auto=format&fit=crop",

  /** Modern office / commercial */
  office: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80",
  /** Cooperative / community */
  cooperative: "https://images.unsplash.com/photo-1577416416181-f2842399183b?auto=format&fit=crop&q=80",
} as const;
