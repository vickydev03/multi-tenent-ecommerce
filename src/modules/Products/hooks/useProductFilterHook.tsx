import { useQueryStates, parseAsString } from "nuqs";

export const useProdcutFilters = () => {
  return useQueryStates({
    minPrice: parseAsString.withOptions({
      clearOnDefault: true,
    }),
    maxPrice: parseAsString.withOptions({
      clearOnDefault: true,
    }),
  });
};
