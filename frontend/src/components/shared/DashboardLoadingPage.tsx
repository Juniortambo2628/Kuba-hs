import { Loader2 } from "lucide-react";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { workspaceUi } from "@/lib/dashboard-ui";
import type { DashboardPageWidth } from "@/lib/dashboard-ui";

interface DashboardLoadingPageProps {
  width?: DashboardPageWidth;
  className?: string;
}

/** Full-page centered spinner shown while a dashboard view loads. */
export function DashboardLoadingPage({
  width = "default",
  className = workspaceUi.page,
}: DashboardLoadingPageProps) {
  return (
    <DashboardPageContainer width={width} className={className}>
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardPageContainer>
  );
}
