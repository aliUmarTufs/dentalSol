import algoliasearch from "algoliasearch/lite";

export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

export const algoliaClientAdmin = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  "4df743c61e4f5496fb166a565c1085bb"
);
