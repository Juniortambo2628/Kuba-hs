import React, { FC } from "react";
import SectionGridFilterCard from "../SectionGridFilterCard";
import { StayDataType } from "@/data/types";

async function getServices(): Promise<StayDataType[]> {
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
                name: service.category?.name || service.category || "General",
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
        console.error("Failed to fetch services:", e);
        return [];
    }
}

const ListingStayPage = async () => {
  const settings = await getServices();
  
  return (
    <div className="nc-ListingStayPage">
      <SectionGridFilterCard 
        data={settings}
        className="container pb-24 lg:pb-28" 
      />
    </div>
  );
};

export default ListingStayPage;
