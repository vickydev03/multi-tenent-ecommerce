import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
const sortValues = ["newest", "oldest", "default"];

const params = {
  search: parseAsString.withOptions({
    clearOnDefault: true,
  }).withDefault(""),
  sort: parseAsStringLiteral(sortValues).withDefault("default"),
  minPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  maxPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault([]),
};
export const loadProductFilters = createLoader(params);
