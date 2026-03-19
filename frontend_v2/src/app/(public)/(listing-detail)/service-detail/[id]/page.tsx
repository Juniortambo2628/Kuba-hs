import React from "react";
import ServiceDetailClient from "./ServiceDetailClient";
import { StayDataType } from "@/data/types";

async function getServiceDetail(id: string): Promise<StayDataType | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-services/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const service = json.data;
    if (!service) return null;

    return {
      id: service.id,
      author: {
        id: service.provider?.id,
        firstName: service.provider?.business_name?.split(' ')[0] || "Provider",
        lastName: service.provider?.business_name?.split(' ').slice(1).join(' ') || "",
        displayName: service.provider?.business_name || "Service Professional",
        avatar: service.provider?.logo || "/placeholder-light.png",
        count: service.provider?.review_count || 0,
        desc: service.provider?.bio || "Passionate professional dedicated to delivering quality service to the Kuba community.",
        jobName: "Service Professional",
        href: `/author/${service.provider?.id}` as any,
        starRating: service.provider?.rating || 4.5,
      },
      date: service.created_at ? new Date(service.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Service",
      href: `/service-detail/${service.id}` as any,
      title: service.name,
      featuredImage: service.image_urls?.[0] || service.service_thumbnail_url || "/placeholder-light.png",
      commentCount: service.provider?.review_count || 0,
      viewCount: 0,
      address: service.provider?.location_name || "Nairobi",
      reviewStart: service.provider?.rating || 4.5,
      reviewCount: service.provider?.review_count || 0,
      like: false,
      galleryImgs: service.image_urls && service.image_urls.length > 0 ? service.image_urls : [service.service_thumbnail_url || "/placeholder-light.png"],
      price: `$${service.base_price}`,
      listingCategory: {
        id: 1,
        name: service.category || "General",
        href: "/listing-service" as any,
        taxonomy: "category"
      },
      maxGuests: 1,
      bedrooms: 0,
      bathrooms: 0,
      saleOff: null,
      isAds: null,
      map: { lat: 0, lng: 0 },
      reviews: service.provider?.reviews?.map((r: any) => ({
        id: r.id,
        name: r.user?.name || "Customer",
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        comment: r.comment,
        starRating: r.rating,
        avatar: r.user?.avatar || ""
      })) || []
    } as any;
  } catch (error) {
    console.error("Failed to fetch service detail:", error);
    return null;
  }
}

async function getCategories(): Promise<any[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((cat: any) => ({
      id: cat.id,
      href: `/listing-service?category=${cat.id}`,
      name: cat.name,
      taxonomy: "category",
      count: cat.services_count || 0,
      thumbnail: cat.thumbnail_url || "/placeholder-light.png"
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const service = await getServiceDetail(id);
  const categories = await getCategories();

  if (!service) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-semibold">Service not found</h2>
        <p className="mt-2 text-neutral-500">The service you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return <ServiceDetailClient data={service} categories={categories} />;
};

export default Page;
