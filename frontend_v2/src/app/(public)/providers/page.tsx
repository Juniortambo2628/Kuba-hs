import React from "react";
import SectionGridAuthorBox from "@/components/SectionGridAuthorBox";
import { AuthorType } from "@/data/types";
import BackgroundSection from "@/components/BackgroundSection";

async function getProviders(): Promise<AuthorType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers`, { cache: 'no-store' });
    const json = await res.json();
    return (json.data || []).map((provider: any) => ({
      id: provider.id,
      firstName: provider.business_name?.split(' ')[0] || "Provider",
      lastName: provider.business_name?.split(' ').slice(1).join(' ') || "",
      displayName: provider.business_name || "Service Professional",
      avatar: provider.logo || "/placeholder-light.png",
      count: provider.review_count || 0,
      desc: provider.bio || "Professional service provider on the Kuba platform.",
      jobName: "Service Professional",
      href: `/author/${provider.id}` as any,
      starRating: provider.rating || 4.5,
    }));
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    return [];
  }
}

const ProvidersPage = async () => {
    const providers = await getProviders();

    return (
        <div className="nc-ProvidersPage relative">
            <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
                <main>
                    <SectionGridAuthorBox 
                        authors={providers}
                        heading="Our Service Professionals"
                        subHeading="Meet the experts dedicated to quality and reliability"
                    />
                </main>

                <div className="relative py-16">
                    <BackgroundSection className="bg-neutral-100 dark:bg-black/20" />
                    <div className="max-w-screen-md mx-auto text-center">
                        <h2 className="text-3xl font-semibold">Join the network</h2>
                        <p className="mt-4 text-neutral-500">
                            Are you a professional looking to grow your business? Join the Kuba network today and reach thousands of customers.
                        </p>
                        <div className="mt-8">
                            <a href="/register?role=provider" className="nc-Button inline-flex items-center justify-center h-auto px-6 py-3 sm:px-10 font-medium rounded-full transition-all bg-primary-6000 hover:bg-primary-700 text-neutral-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000">
                                Become a Provider
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProvidersPage;
