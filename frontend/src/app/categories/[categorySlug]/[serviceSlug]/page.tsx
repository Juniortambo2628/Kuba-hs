import { redirect } from "next/navigation";

export default async function LegacyServiceSlugRedirectPage({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  const { serviceSlug } = await params;
  redirect(`/services/${serviceSlug}`);
}
