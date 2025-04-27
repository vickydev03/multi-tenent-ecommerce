"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import React, { useRef, useState } from "react";
import SubCategoriesMenu from "./SubCategoriesMenu";
import {useDropDownPosition} from "@/hooks/useDropDownPosition";
interface type {
  category: Category & { subCategories?: Category[] };
  isActive?: boolean;
  isNavigationHovered?: boolean;
}
function CategoryDropdown({ category, isActive, isNavigationHovered }: type) {
  console.log(category, "test");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const {getDropDownPosition} = useDropDownPosition(dropDownRef);
  let dropdownPosition=getDropDownPosition()
  
  const mouseEnter = () => {
    if (category.subCategories) {
      console.log("hello");

      setIsOpen(true);
    }
  };

  const mouseLeave = () => {
    setIsOpen(false);
  };
  return (
    <div
      className="relative"
      ref={dropDownRef}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
    >
      <Button
        variant={"elevated"}
        className={cn(
          "h-11 px-su4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
          isActive && !isNavigationHovered && "bg-white border-primary"
        )}
      >
        {category.name}
      </Button>

      {category.subCategories && category.subCategories.length > 0 && (
        <div
          className={cn(
            "absolute opacity-0  -bottom-3 w-3 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2  ",
            isOpen && "opacity-100"
          )}
        />
      )}
      <SubCategoriesMenu category={category} isOpen={isOpen} position={dropdownPosition} />
    </div>
  );
}

export default CategoryDropdown;
