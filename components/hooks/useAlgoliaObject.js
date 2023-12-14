import algoliasearch from "algoliasearch";
import { useEffect, useState } from "react";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

export default function useAlgoliaObject(indexName, id) {
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const index = searchClient.initIndex(indexName);

    index
      .getObjects([id])
      .then(({ results: [obj] }) => {
        setObject(obj);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [id, indexName]);

  return {
    loading,
    object,
  };
}
