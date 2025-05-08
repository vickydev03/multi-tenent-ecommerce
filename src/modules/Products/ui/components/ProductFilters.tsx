"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon, Icon } from "lucide-react";
import React, { useState } from "react";
import PriceFilter from "./PriceFilter";
import { useProdcutFilters } from "../../hooks/useProductFilterHook";
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
  const handleClear = () => {};

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };
  return (
    <div className="border rounded-md bg-white">
      <div className="flex p-4 border-b items-center justify-between">
        <p className="font-medium ">Filters</p>
        <button onClick={handleClear} className="underline">
          Clear
        </button>
      </div>
      <ProductFilter title="price " className="border-b-0 ">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMaxPriceChange={(value) => onChange("maxPrice",value )}
          onMinPriceChange={(value) => onChange("minPrice",value )}
        />
      </ProductFilter>
    </div>
  );
}

export default ProductFilters;
