import { createSearchParamsCache, parseAsString } from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const searchParamsParser = {
  name: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParser);
