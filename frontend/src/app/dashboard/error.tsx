"use client";

import { RouteError } from "@/components/shared/RouteError";

export default function DashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      {...props}
      title="Dashboard Error"
      description="Something went wrong in the dashboard. Please try again."
    />
  );
}
