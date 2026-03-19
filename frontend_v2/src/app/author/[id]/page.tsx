import React from "react";
import StayCard2 from "@/components/StayCard2";
import { StayDataType } from "@/data/types";
import Avatar from "@/shared/Avatar";
import StartRating from "@/components/StartRating";
import SocialsList from "@/shared/SocialsList";

async function getProviderDetail(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch provider detail:", error);
    return null;
  }
}

const AuthorDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const provider = await getProviderDetail(id);

  if (!provider) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-semibold">Provider not found</h2>
        <p className="mt-2 text-neutral-500">The professional profile you are looking for does not exist.</p>
      </div>
    );
  }

  const listings: StayDataType[] = (provider.provider_services || []).map((ps: any) => ({
    id: ps.id,
    author: {
      id: provider.id,
      firstName: provider.business_name?.split(' ')[0],
      lastName: provider.business_name?.split(' ').slice(1).join(' '),
      displayName: provider.business_name,
      avatar: provider.logo || "/placeholder-light.png",
      count: provider.review_count || 0,
      desc: provider.bio || "",
      jobName: "Service Professional",
      href: `/author/${provider.id}`,
      starRating: provider.rating || 0,
    },
    date: "Available Now",
    href: `/service-detail/${ps.id}`,
    title: ps.service?.name || "Service",
    featuredImage: ps.service?.service_thumbnail_url || "/placeholder-light.png",
    commentCount: provider.review_count || 0,
    viewCount: 0,
    address: provider.location_name || "Nairobi",
    reviewStart: provider.rating || 0,
    reviewCount: provider.review_count || 0,
    like: false,
    galleryImgs: ps.media?.map((m: any) => m.original_url) || [],
    price: `$${ps.base_price}`,
    listingCategory: {
      id: ps.service?.category?.id || 1,
      name: ps.service?.category?.name || "General",
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

  return (
    <div className="nc-AuthorDetailPage">
      <main className="container mt-12 mb-24 lg:mb-32 flex flex-col lg:flex-row">
        <div className="block flex-grow mb-24 lg:mb-0">
          <div className="lg:sticky lg:top-24">
            <div className=" w-full flex flex-col items-center text-center sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8">
              <Avatar
                hasChecked
                hasCheckedClass="w-6 h-6 -top-0.5 right-2"
                sizeClass="w-28 h-28"
                imgUrl={provider.logo || ""}
                userName={provider.business_name}
              />
              <div className="space-y-3 text-center flex flex-col items-center">
                <h2 className="text-3xl font-semibold">{provider.business_name}</h2>
                <StartRating className="!text-base" point={provider.rating || 0} reviewCount={provider.review_count || 0} />
              </div>
              <p className="text-neutral-500 dark:text-neutral-400">
                {provider.bio || "No biography provided."}
              </p>
              <SocialsList
                className="!space-x-3"
                itemClass="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl"
              />
              <div className="border-b border-neutral-200 dark:border-neutral-700 w-14"></div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-neutral-6000 dark:text-neutral-300">{provider.location_name || "Nairobi"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
          <div className="listingSection__wrap">
            <div>
              <h2 className="text-2xl font-semibold">{provider.business_name}'s Services</h2>
              <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                Browse professional services offered by {provider.business_name}.
              </span>
            </div>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
              {listings.map((stay) => (
                <StayCard2 key={stay.id} data={stay} />
              ))}
              {listings.length === 0 && (
                <p className="text-neutral-500 italic">No active services listed at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthorDetailPage;
