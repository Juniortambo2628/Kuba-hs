import CardCategoryBox1 from "@/components/CardCategoryBox1";
import Heading from "@/shared/Heading";
import { TaxonomyType } from "@/data/types";
import React from "react";

export interface SectionGridCategoryBoxProps {
  categories?: TaxonomyType[];
  headingCenter?: boolean;
  categoryCardType?: "card1";
  className?: string;
  gridClassName?: string;
}

const DEMO_CATS: TaxonomyType[] = [
  {
    id: "1",
    href: "/listing-service?category=cleaning",
    name: "Cleaning",
    taxonomy: "category",
    count: 145,
    thumbnail: "https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg",
  },
  {
    id: "2",
    href: "/listing-service?category=repairs",
    name: "Repairs",
    taxonomy: "category",
    count: 211,
    thumbnail: "https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg",
  },
  {
    id: "3",
    href: "/listing-service?category=beauty",
    name: "Beauty",
    taxonomy: "category",
    count: 98,
    thumbnail: "https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg",
  },
  {
    id: "4",
    href: "/listing-service?category=wellness",
    name: "Wellness",
    taxonomy: "category",
    count: 76,
    thumbnail: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg",
  },
  {
    id: "5",
    href: "/listing-service?category=legal",
    name: "Legal",
    taxonomy: "category",
    count: 34,
    thumbnail: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg",
  },
  {
    id: "6",
    href: "/listing-service?category=tech",
    name: "Tech",
    taxonomy: "category",
    count: 52,
    thumbnail: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
  },
];

const SectionGridCategoryBox: React.FC<SectionGridCategoryBoxProps> = ({
  categories = DEMO_CATS,
  categoryCardType = "card1",
  headingCenter = true,
  className = "",
  gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => {
  let CardComponentName = CardCategoryBox1;
  switch (categoryCardType) {
    case "card1":
      CardComponentName = CardCategoryBox1;
      break;

    default:
      CardComponentName = CardCategoryBox1;
  }

  return (
    <div className={`nc-SectionGridCategoryBox relative ${className}`}>
      <Heading
        desc="Access the best local professionals for home, wellness, and digital services"
        isCenter={headingCenter}
      >
        Quick Access
      </Heading>
      <div className={`grid ${gridClassName} gap-5 sm:gap-6 md:gap-8`}>
        {categories.map((item, i) => (
          <CardComponentName key={i} taxonomy={item} />
        ))}
      </div>
    </div>
  );
};

export default SectionGridCategoryBox;
