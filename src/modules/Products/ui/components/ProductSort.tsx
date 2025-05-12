"use client"
import React from "react";
import { useProdcutFilters } from "../../hooks/useProductFilterHook";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
function ProductSort() {
    const [filters, setFilters] = useProdcutFilters();
  return (
    <div className="flex items-center gap-2">
      <Button
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "default" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "default" })}
        size="sm"
      >
        Default
      </Button>
      <Button
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "default" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "newest" })}
        size="sm"
      >
        Newest
      </Button>
      <Button
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "default" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "oldest" })}
        size="sm"
      >
        Oldest
      </Button>
    </div>
  );
}

export default ProductSort;
