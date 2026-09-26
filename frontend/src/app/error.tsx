"use client";

import { RouteError } from "@/components/shared/RouteError";

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      {...props}
      title="Something went wrong"
      description="An unexpected error occurred. Please try again."
    />
  );
}
