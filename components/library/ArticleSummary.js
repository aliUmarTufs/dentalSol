import { fallbackImgUrl } from "../atoms/fallbackImgUrl";
import AuthorSummary, { AuthorSummarySkeleton } from "./AuthorSummary";
import Pill from "../atoms/Pill";

export default function ArticleSummary(props) {
  const { hit } = props;

  return (
    <div className="h-full">
      <a href={`/library/article/${hit.id}`}>
        <div
          style={{
            backgroundImage: `url('${hit.thumbnail || fallbackImgUrl}')`,
          }}
          className="h-full m-h-10 flex flex-col justify-center bg-cover bg-scroll bg-center bg-no-repeat relative"
        >
          <div className="flex flex-col justify-around p-5 relative h-full w-full backdrop-filter backdrop-blur-lg">
            <p
              className="text-2xl font-semibold text-white"
              style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.2)" }}
            >
              {hit.title}
            </p>
            <p
              className="mt-3 text-base text-white text-ellipsis"
              style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.2)" }}
            >
              {hit.description}
            </p>
            <div>
              {hit.category && (
                <Pill
                  color={hit.category?.type === "clinical" ? "green" : "blue"}
                  className="m-1 max-w-sm"
                >
                  {hit.category?.label}
                </Pill>
              )}
              <AuthorSummary {...hit} color="white" />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export function ArticleSummarySkeleton() {
  return (
    <div className="h-72 w-full flex flex-col justify-end bg-gray-100 animate-pulse">
      <div className="p-5">
        <AuthorSummarySkeleton />
      </div>
    </div>
  );
}
