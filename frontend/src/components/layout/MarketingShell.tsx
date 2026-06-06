import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface MarketingShellProps {
  children: React.ReactNode;
  className?: string;
}

/** Shared public marketing layout: nav + content + footer */
export function MarketingShell({ children, className = "min-h-screen" }: MarketingShellProps) {
  return (
    <div className={className}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
