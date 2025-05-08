"use client";
import React from "react";
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

const formateAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, " ");
  const parts = numericValue.split(".");

  const formateValue =
    parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");

  if (!formateValue) return "";

  const numberValue = parseFloat(formateValue);
  if (isNaN(numberValue)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

function PriceFilter({
  minPrice,
  maxPrice,
  onMaxPriceChange,
  onMinPriceChange,
}: Props) {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericvalue = e.target.value.replace(/[^0-9.]/g, " ");
    onMinPriceChange(numericvalue);
  };
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericvalue = e.target.value.replace(/[^0-9.]/g, " ");
    onMaxPriceChange(numericvalue);
  };
  return (
    <div
      className=" flex flex-col gap-2 
  "
    >
      <div className="flex flex-col gap-2 ">
        <Label className="font-medium text-base">Minimum Price</Label>
        <Input
          type="text"
          placeholder="$0"
          value={minPrice ? formateAsCurrency(minPrice) : ""}
          onChange={ handleMinPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2 ">
        <Label className="font-medium text-base">Maximum Price</Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPrice ? formateAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
}

export default PriceFilter;
