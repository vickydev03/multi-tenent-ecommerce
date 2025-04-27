import React from "react";
import CategoryDropdown from "./CategoryDropdown";
import { Category } from "@/payload-types";
function Categories({ data }: { data: any }) {
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center">
        {data.map((e: Category) => {
          return (
            <div key={e.id}>
              <CategoryDropdown
                category={e}
                isActive={false}
                isNavigationHovered={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;
