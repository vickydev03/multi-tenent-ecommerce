import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constant";
import { LoaderIcon } from "lucide-react";
interface Props {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

function TagsFilters({ value = [], onChange }: Props) {
  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      // Remove the tag
      onChange(value.filter((e) => e !== tag));
    } else {
      // Add the tag
      onChange([...(value || []), tag]);
    }
  };

  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
          // cursor:1
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );
  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4 ">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((e) =>
          e.docs.map((tags) => (
            <div
              className="flex items-center justify-between cursor-pointer"
              key={tags.id}
              onClick={() => onClick(tags.name)}
            >
              <p className="font-medium"> {tags.name}</p>
              <Checkbox
                checked={value?.includes(tags.name)}
                onCheckedChange={() => onClick(tags.name)}
              />
            </div>
          ))
        )
      )}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="underline font-medium justify-start text-start disabled:opacity-50"
        >
          Load more ...
        </button>
      )}
    </div>
  );
}

export default TagsFilters;
