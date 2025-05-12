"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon, Icon } from "lucide-react";
import React, { useState } from "react";
import PriceFilter from "./PriceFilter";
import { useProdcutFilters } from "../../hooks/useProductFilterHook";
import TagsFilters from "./TagsFilters";
interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ProductFilter = ({ title, className, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("p-4 border-b flex flex-col gap-2 ", className)}>
      <div
        onClick={() => setIsOpen((e) => !e)}
        className="flex items-center  justify-between cursor-pointer "
      >
        <p className="font-medium ">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};
function ProductFilters() {
  const [filters, setFilters] = useProdcutFilters();

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key == "sort") return false;

    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string") {
      return value !== "";
    }
    return value !== null;
  });

  const handleClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };
  return (
    <div className="border rounded-md bg-white">
      <div className="flex p-4 border-b items-center justify-between">
        <p className="font-medium ">Filters</p>
        {hasAnyFilters && (
          <button onClick={handleClear} className="underline">
            Clear
          </button>
        )}
      </div>
      <ProductFilter title="price " className="border-b ">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
          onMinPriceChange={(value) => onChange("minPrice", value)}
        />
      </ProductFilter>
      <ProductFilter title="tags " className="border-b ">
        <TagsFilters
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilter>
    </div>
  );
}

export default ProductFilters;
