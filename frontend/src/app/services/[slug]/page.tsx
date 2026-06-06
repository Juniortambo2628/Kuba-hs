import { Suspense } from "react";
import ServiceDetailClient from "./ServiceDetailClient";
import { HeroSkeleton } from "@/components/shared/AdvancedSkeleton";

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <ServiceDetailClient params={params} />
    </Suspense>
  );
}
