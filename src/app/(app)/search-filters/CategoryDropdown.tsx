"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import React, { useRef, useState } from "react";
import SubCategoriesMenu from "./SubCategoriesMenu";
import { useDropDownPosition } from "@/hooks/useDropDownPosition";
import Link from "next/link";
import { CustomCategory } from "@/types";
interface type {
  category: any;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}
function CategoryDropdown({ category, isActive, isNavigationHovered }: type) {
  console.log(category, "test");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  // const { getDropDownPosition } = useDropDownPosition(dropDownRef);
  // let dropdownPosition = getDropDownPosition();

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
      <div className="relative">
        <Button
          variant="elevated"
          asChild
          className={cn(
            "h-11 px-su4 bg-transparent border-transparent rounded-full text-black transition-all",
            "hover:bg-white hover:border-primary",
            isActive && !isNavigationHovered && "bg-white border-primary",
            isOpen &&
              "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px]"
          )}
        >
          <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>
      </div>

      {category.subCategories && category.subCategories.length > 0 && (
        <div
          className={cn(
            "absolute opacity-0  -bottom-3 w-3 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2  ",
            isOpen && "opacity-100"
          )}
        />
      )}
      <SubCategoriesMenu
        category={category}
        isOpen={isOpen}
        // position={dropdownPosition}
      />
    </div>
  );
}

export default CategoryDropdown;
