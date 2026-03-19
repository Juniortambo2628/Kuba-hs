import React from "react";
import SectionHero from "@/app/(server-components)/SectionHero";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import { TaxonomyType, StayDataType, AuthorType } from "@/data/types";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionOurFeatures from "@/components/SectionOurFeatures";
import BackgroundSection from "@/components/BackgroundSection";
import SectionGridFeaturePlaces from "@/components/SectionGridFeaturePlaces";
import SectionHowItWork from "@/components/SectionHowItWork";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import SectionGridAuthorBox from "@/components/SectionGridAuthorBox";
import SectionGridCategoryBox from "@/components/SectionGridCategoryBox";
import SectionBecomeAnAuthor from "@/components/SectionBecomeAnAuthor";
import SectionCorporate from "@/components/SectionCorporate";
import SectionVideos from "@/components/SectionVideos";
import SectionClientSay from "@/components/SectionClientSay";

async function getCategories(): Promise<TaxonomyType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: 'no-store' });
    const json = await res.json();
    return (json.data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      href: `/listing-service?category=${cat.id}`,
      count: cat.services?.length || 0,
      thumbnail: cat.icon || "/placeholder-light.png",
      taxonomy: "category"
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

async function getFeaturedServices(): Promise<StayDataType[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-services`, { cache: 'no-store' });
        const json = await res.json();
        return (json.data || []).map((service: any) => ({
            id: service.id,
            author: {
                id: service.provider?.id,
                firstName: service.provider?.business_name?.split(' ')[0] || "Provider",
                lastName: service.provider?.business_name?.split(' ').slice(1).join(' ') || "",
                displayName: service.provider?.business_name || "Service Professional",
                avatar: service.provider?.logo || "/placeholder-light.png",
                count: service.provider?.review_count || 0,
                desc: service.provider?.bio || "",
                jobName: "Service Professional",
                href: `/author/${service.provider?.id}`,
            },
            date: "May 20, 2021", 
            href: `/service-detail/${service.id}`,
            title: service.name,
            featuredImage: service.image_urls?.[0] || service.service_thumbnail_url || "/placeholder-light.png",
            commentCount: service.provider?.review_count || 0,
            viewCount: 0,
            address: service.provider?.location_name || "Nairobi",
            reviewStart: service.provider?.rating || 4.5,
            reviewCount: service.provider?.review_count || 0,
            like: false,
            galleryImgs: service.image_urls || [],
            price: `$${service.base_price}`,
            listingCategory: {
                id: 1,
                name: service.category || "General",
                href: "/listing-service",
                taxonomy: "category"
            },
            maxGuests: 1,
            bedrooms: 0,
            bathrooms: 0,
            saleOff: null,
            isAds: null,
            map: { lat: 0, lng: 0 }
        }));
    } catch (e) {
        console.error("Failed to fetch featured services:", e);
        return [];
    }
}

async function getFeaturedProviders(): Promise<AuthorType[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/top-providers`, { cache: 'no-store' });
        const json = await res.json();
        return (json.data || []).map((provider: any) => ({
            id: provider.id,
            firstName: provider.business_name?.split(' ')[0] || "Provider",
            lastName: provider.business_name?.split(' ').slice(1).join(' ') || "",
            displayName: provider.business_name || "Service Professional",
            avatar: provider.logo || "/placeholder-light.png",
            count: provider.review_count || 0,
            desc: provider.bio || "",
            jobName: "Service Professional",
            href: `/author/${provider.id}`,
            starRating: provider.rating || 4.5,
        }));
    } catch (e) {
        console.error("Failed to fetch featured providers:", e);
        return [];
    }
}

async function PageHome() {
  const categories = await getCategories();
  const featuredServices = await getFeaturedServices();
  const featuredProviders = await getFeaturedProviders();

  return (
    <main className="nc-PageHome relative overflow-hidden">
      <BgGlassmorphism />

      <div className="container relative space-y-24 mb-24 lg:space-y-28 lg:mb-28">
        {/* 1. Hero Section */}
        <SectionHero className="pt-10 lg:pt-16 lg:pb-16" />

        {/* 2. Quick Access Grid (Top 6 Icons) */}
        <SectionGridCategoryBox />

        {/* 3. Why Kuba Section (Trust Pillars) */}
        <SectionOurFeatures />

        {/* 4. Featured Services (Marketplace) */}
        <SectionGridFeaturePlaces 
            cardType="card2" 
            heading="Featured Services"
            subHeading="Popular services from top-rated professionals"
            stayListings={featuredServices}
        />

        {/* 5. How It Works */}
        <SectionHowItWork />

        {/* 6. Featured Providers (Trust-Building) */}
        <div className="relative py-16">
          <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20 " />
          <SectionGridAuthorBox 
            authors={featuredProviders}
            className=""
          />
        </div>

        {/* 7. Corporate Solutions CTA */}
        <div className="relative py-16">
          <BackgroundSection className="bg-neutral-100 dark:bg-black/20" />
          <SectionCorporate />
        </div>

        {/* 8. Join Kuba Professional Network */}
        <div className="relative py-16">
          <SectionBecomeAnAuthor />
        </div>

        {/* Optional: Keep Subscribe for newsletter but at the bottom */}
        <SectionSubscribe2 />
      </div>
    </main>
  );
}

export default PageHome;
