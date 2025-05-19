import { Category } from "@/payload-types";
import Link from "next/link";
import React from "react";

interface type {
  category: Category & { subCategories?: Category[] };
  // category: Category & { subCategories?: Category[] };
  isOpen: boolean;
  // position: { top: number; left: number };
}
function SubCategoriesMenu({ category, isOpen }: type) {
  if (
    !isOpen ||
    category.subCategories?.length === 0 ||
    !category.subCategories
  ) {
    return null;
  }

  const backGroundColor = category.color || "#f5f5f5";

  return (
    <div
      className=" absolute z-100 "
      style={{
        top: "100%",
        left: 0,
      }}
    >
      <div className="h-10 " />
      <div className=" relative">
        <div className="w-60 h-3 " />
        <div
          className="w-60 text-black rounded-md overflow-hidden  border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] absolute -left-12 "
          style={{ backgroundColor: backGroundColor }}
        >
          <div className="">
            {category.subCategories.map((subcategory: Category) => (
              <Link
                key={subcategory.slug}
                href={`/${category.slug}/${subcategory.slug}`}
                className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubCategoriesMenu;
// bun tsx ./node_modules/payload/bin.js generate:types
