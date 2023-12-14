import {
  connectInfiniteHits,
  connectStateResults,
} from "react-instantsearch-dom";
import Button from "../atoms/Button";
import ArticleSummary, { ArticleSummarySkeleton } from "./ArticleSummary";

export default connectInfiniteHits(({ hits, hasMore, refineNext }) => {
  return (
    <div className="h-auto">
      {!!hits.length ? (
        <div className="flex flex-col justify-center items-center">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
            {hits.map((hit) => (
              <ArticleSummary key={hit.id} hit={hit} />
            ))}
          </div>
          {hasMore && (
            <Button onClick={refineNext} className="mt-5 w-1/3">
              Load more
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
          <ArticleSummarySkeleton />
          <ArticleSummarySkeleton />
          <ArticleSummarySkeleton />
          <ArticleSummarySkeleton />
          <ArticleSummarySkeleton />
          <ArticleSummarySkeleton />
        </div>
      )}
    </div>
  );
});
