"use client";
import React, { useEffect, useRef, useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { Category } from "@/payload-types";
import { CustomCategory } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ListFilterIcon } from "lucide-react";
import CategoriesSideBar from "./CategoriesSideBar";
function Categories({ data }: { data: CustomCategory[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const ViewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  console.log(isSidebarOpen,"sidebar ");
  
  const activeCategory = "all";
  let activeCategoryIndex = data.findIndex(
    (cat) => cat.slug === activeCategory
  );
  const IsActiveCategoryHidden =
    visibleCount <= activeCategoryIndex && activeCategoryIndex !== -1;

  console.log("here we go", activeCategoryIndex);

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !ViewAllRef.current) {
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = ViewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      console.log(items, "i am items");

      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }
      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, [data.length]);

  console.log(visibleCount, "hiiklajklfja");

  return (
    <div className="relative w-full">
      <CategoriesSideBar
        open={isSidebarOpen}
        onOpenChange={setIsSideBarOpen}
        data={data}
      />
      <div
        className=" absolute top-9999 opacity-0 pointer-events-none flex "
        ref={measureRef}
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {/* hiddden meausre ref */}
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

      {/* visible one */}
      <div
        className="flex flex-nowrap items-center"
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((e: Category) => {
          return (
            <div className="bg-red-4000" key={e.id}>
              <CategoryDropdown
                category={e}
                isActive={false}
                isNavigationHovered={false}
              />
            </div>
          );
        })}
        <div className=" shrink-0" ref={ViewAllRef}>
          <Button
          onClick={()=>setIsSideBarOpen(true)}
            className={cn(
              "h-11 px-su4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              IsActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-primary"
            )}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Categories;
