/**
 * Centralized Design System Manifest
 * Yardstick: Investors Page (/investors)
 */

export const designSystem = {
  typography: {
    hero: {
      badge: "inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full",
      title: "text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-tight",
      subtitle: "max-w-2xl mx-auto text-lg text-gray-600 dark:text-muted-foreground mb-10 leading-relaxed",
    },
    section: {
      badge: "inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-tight text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full",
      title: "text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight",
      subtitle: "max-w-2xl mx-auto text-lg text-gray-600 dark:text-muted-foreground leading-relaxed font-medium",
      paragraph: "text-gray-600 dark:text-muted-foreground leading-relaxed font-medium",
      cardTitle: "text-xl font-bold tracking-tight",
      cardText: "text-gray-600 dark:text-muted-foreground leading-relaxed font-medium text-sm",
    },
    legal: {
      h1: "text-4xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white leading-tight",
      h2: "text-xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white",
      meta: "text-[11px] font-semibold text-muted-foreground tracking-tight",
      paragraph: "text-gray-600 dark:text-muted-foreground leading-relaxed font-medium",
    },
    auth: {
      h1: "text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight text-center lg:text-left",
      subtitle: "text-gray-600 dark:text-muted-foreground leading-relaxed font-medium italic mt-2 text-center lg:text-left",
      label: "text-xs font-semibold text-muted-foreground tracking-tight ml-1",
      input: "bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 h-14 rounded-2xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 text-sm font-bold",
      button: "w-full h-14 bg-primary dark:bg-indigo-600 hover:bg-primary/90 dark:hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all tracking-tight text-sm",
    }
  },
  layouts: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-24",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
  }
};
