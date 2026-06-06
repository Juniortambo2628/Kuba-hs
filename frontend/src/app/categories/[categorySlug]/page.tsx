import { redirect } from "next/navigation";

export default async function CategorySlugRedirectPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  redirect(`/services?category=${categorySlug}`);
}
