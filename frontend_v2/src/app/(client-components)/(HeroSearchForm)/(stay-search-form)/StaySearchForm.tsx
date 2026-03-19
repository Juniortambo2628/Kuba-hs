import React, { FC, useState } from "react";
import LocationInput from "../LocationInput";
import KubaSearchModal from "@/components/KubaSearchModal";

const StaySearchForm: FC<{}> = ({}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const renderForm = () => {
    return (
      <>
        <div 
            className="w-full relative mt-8 flex rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800 cursor-pointer"
            onClick={() => setIsSearchModalOpen(true)}
        >
            <LocationInput 
                className="flex-1" 
                placeHolder="Search services..." 
                desc="What are you looking for?"
                disableClick={true}
            />
        </div>
        
        <KubaSearchModal 
            isOpen={isSearchModalOpen} 
            onClose={() => setIsSearchModalOpen(false)} 
        />
      </>
    );
  };

  return renderForm();
};

export default StaySearchForm;
