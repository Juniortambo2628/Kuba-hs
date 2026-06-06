"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipTransition =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (skipTransition) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.22, 1, 0.36, 1], // Custom quint ease for premium feel
          delay: 0.1
        }}
        className="w-full h-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
