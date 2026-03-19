"use client";

import React, { FC, Fragment, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import CommentListing from "@/components/CommentListing";
import FiveStartIconForRate from "@/components/FiveStartIconForRate";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonClose from "@/shared/ButtonClose";
import Input from "@/shared/Input";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Amenities_demos } from "./constant";
import StayDatesRangeInput from "./StayDatesRangeInput";
import GuestsInput from "./GuestsInput";
import SectionDateRange from "../../SectionDateRange";
import { Route } from "next";
import { StayDataType, TaxonomyType } from "@/data/types";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";

export interface ServiceDetailClientProps {
  data: any;
  categories?: TaxonomyType[];
}

const ServiceDetailClient: FC<ServiceDetailClientProps> = ({ data, categories = [] }) => {
  const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const thisPathname = usePathname();
  const router = useRouter();

  const {
      id,
      title,
      galleryImgs,
      listingCategory,
      address,
      author,
      price,
      reviewStart,
      reviewCount,
      reviews = [],
      date,
  } = data;

  const PHOTOS = galleryImgs;

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        <div className="flex justify-between items-center">
          <Badge name={listingCategory.name} />
          <LikeSaveBtns />
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {title}
        </h2>

        <div className="flex items-center space-x-4">
          <StartRating point={reviewStart} reviewCount={reviewCount} />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1"> {address}</span>
          </span>
        </div>

        <div className="flex items-center">
          <Avatar imgUrl={author.avatar} hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Professional:{" "}
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              {author.displayName}
            </span>
          </span>
        </div>

        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />

        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center space-x-3 ">
            <i className=" las la-user text-2xl "></i>
            <span className="">
              Individual <span className="hidden sm:inline-block">provider</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-check-circle text-2xl"></i>
            <span className=" ">
              Verified <span className="hidden sm:inline-block">Service</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Service Description</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300">
          <span>
            {author.desc || "No detailed description provided for this service yet."}
          </span>
        </div>
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Service Highlights</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            What to expect from this professional service
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {[
            { name: "Verified Professional", icon: "la-user-check" },
            { name: "Quality Guarantee", icon: "la-certificate" },
            { name: "Secure Payment", icon: "la-shield-alt" },
            { name: "Timely Delivery", icon: "la-clock" },
            { name: "Transparent Pricing", icon: "la-tag" },
            { name: "Customer Support", icon: "la-headset" }
          ].map((item) => (
            <div key={item.name} className="flex items-center space-x-3">
              <i className={`text-3xl las ${item.icon}`}></i>
              <span className=" ">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMotalAmenities = () => {
    return (
      <Transition appear show={isOpenModalAmenities} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-40" />
            </TransitionChild>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="inline-block py-8 h-screen w-full max-w-4xl focus:outline-none">
                <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="headlessui-dialog-title-70">
                      All Skills & Tools
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalAmenities} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {Amenities_demos.map((item) => (
                      <div key={item.name} className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8">
                        <i className={`text-4xl text-neutral-6000 las ${item.icon}`}></i>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Professional Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="flex items-center space-x-4">
          <Avatar
            imgUrl={author.avatar}
            hasChecked
            hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
            sizeClass="h-14 w-14"
            radius="rounded-full"
          />
          <div>
            <a className="block text-xl font-medium" href={author.href}>
              {author.displayName}
            </a>
            <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <StartRating point={author.starRating || 5} />
              <span className="mx-2">·</span>
              <span> {author.count} reviews</span>
            </div>
          </div>
        </div>

        <span className="block text-neutral-6000 dark:text-neutral-300">
          {author.desc || "Passionate professional dedicated to delivering quality service to the Kuba community."}
        </span>

        <div className="block text-neutral-500 dark:text-neutral-400 space-y-2.5">
          <div className="flex items-center space-x-3">
             <i className="las la-calendar text-2xl"></i>
            <span>Verified Kuba Professional</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="las la-comment-dots text-2xl"></i>
            <span>Response rate - 100%</span>
          </div>
        </div>

        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <ButtonSecondary href={author.href}>See professional profile</ButtonSecondary>
        </div>
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Reviews ({reviewCount} reviews)</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="space-y-5">
          <FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
          <div className="relative">
            <Input
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Share your experience with this professional ..."
            />
            <ButtonCircle className="absolute right-2 top-1/2 transform -translate-y-1/2" size=" w-12 h-12 ">
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {reviews.map((review: any) => (
             <CommentListing 
                key={review.id} 
                className="py-8" 
                data={{
                  name: review.name,
                  date: review.date,
                  comment: review.comment,
                  starPoint: review.starRating,
                  avatar: review.avatar
                }} 
              />
          ))}
          {reviews.length === 0 && (
             <p className="py-8 text-neutral-500 italic">No reviews yet for this professional.</p>
          )}
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            {price}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /base
            </span>
          </span>
          <StartRating point={reviewStart} reviewCount={reviewCount} />
        </div>

        <form className="flex flex-col border border-neutral-100 dark:border-neutral-700 rounded-2xl ">
          <StayDatesRangeInput className="flex-1 z-[11]" />
          <div className="w-full border-b border-neutral-100 dark:border-neutral-700"></div>
          <div className="p-3 flex justify-between items-center">
            <span className="text-sm font-medium">Capture Details</span>
            <span className="text-xs text-neutral-500">Service Request</span>
          </div>
        </form>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Base Service Fee</span>
            <span>{price}</span>
          </div>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Platform Fee</span>
            <span>$0</span>
          </div>
          <div className="border-b border-neutral-100 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Estimated Total</span>
            <span>{price}</span>
          </div>
        </div>

        <ButtonPrimary href={`/checkout?serviceId=${id}`}>Book Now</ButtonPrimary>
      </div>
    );
  };

  return (
    <div className="nc-ServiceDetailPage container">
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
          <div className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer" onClick={handleOpenModalImageGallery}>
            <Image
              fill
              className="object-cover rounded-md sm:rounded-xl"
              src={PHOTOS[0] || "/placeholder-light.png"}
              alt=""
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
          </div>
          {PHOTOS.filter((_, i) => i >= 1 && i < 5).map((item, index) => (
            <div key={index} className={`relative rounded-md sm:rounded-xl overflow-hidden ${index >= 3 ? "hidden sm:block" : ""}`}>
              <div className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5">
                <Image
                  fill
                  className="object-cover rounded-md sm:rounded-xl "
                  src={item || "/placeholder-light.png"}
                  alt=""
                  sizes="400px"
                />
              </div>
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={handleOpenModalImageGallery} />
            </div>
          ))}

          <button className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 z-10" onClick={handleOpenModalImageGallery}>
            <Squares2X2Icon className="w-5 h-5" />
            <span className="ml-2 text-sm font-medium">Show all photos</span>
          </button>
        </div>
      </header>

      <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {renderSection5()}
          {renderSection6()}
        </div>

        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>

      {/* EXPLORE SECTION */}
      <div className="relative py-16 lg:py-24 border-t border-neutral-200 dark:border-neutral-700 mt-24">
        <SectionSliderNewCategories
          heading="Explore by types of services"
          subHeading="Discover expert help across various categories"
          categories={categories}
          categoryCardType="card5"
          itemPerRow={5}
        />
      </div>
    </div>
  );
};

export default ServiceDetailClient;
