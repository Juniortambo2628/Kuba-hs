"use client";

import { RouteError } from "@/components/shared/RouteError";

export default function AdminError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      {...props}
      title="Admin Panel Error"
      description="Something went wrong in the admin panel. Please try again."
    />
  );
}
