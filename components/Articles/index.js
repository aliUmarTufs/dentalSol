import { StarIcon } from "@heroicons/react/solid";
import Slider from "react-slick/lib/slider";
import {
  classNames,
  courseSliderSettings,
  NOT_FOUND,
  ROUTES,
} from "../../constants";

import _ from "lodash";
import Link from "next/link";
import ReactStars from "react-stars";
export default function RelatedArticles({ articles }) {
  if (articles?.length < 3) {
    if (articles?.length != 0) {
      courseSliderSettings.slidesToShow = articles.length;
    }
  } else {
    courseSliderSettings.slidesToShow = 3;
  }
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
        Related Articles
      </h2>
      <div className="flex gap-16 w-full">
        {!_.isEmpty(articles) ? (
          <Slider
            {...courseSliderSettings}
            className={"w-full courseSliderWrap"}
          >
            {articles.map((articles) => (
              <div key={articles?.id}>
                <div className="bg-wcourseInfoe relative border sm:rounded-lg flex flex-1 flex-col justify-around h-80 w-full md:w-11/12">
                  <div className="w-full h-full absolute bg-blackish-300"></div>
                  <img
                    src={articles?.thumbnail}
                    className="w-full h-full object-cover"
                  />

                  <div
                    className={
                      "absolute w-full h-auto left-0 right-0 bottom-10 px-6"
                    }
                  >
                    <Link
                      href={`${ROUTES.LIBRARY}/article/${articles.id}`}
                      key={articles.id}
                    >
                      <h2
                        id="timeline-title"
                        className="text-md font-medium text-white cursor-pointer"
                      >
                        {articles?.title}
                      </h2>
                    </Link>

                    <p className="font-regular text-sm mt-3 text-white truncate">
                      {articles?.description}
                    </p>
                    <div className="flex justify-between mt-4">
                      <div className="flex flex-col justify-stretch">
                        <p className="font-semibold text-sm text-blue-600 flex">
                          <ReactStars
                            count={5}
                            size={24}
                            isHalf={true}
                            emptyIcon={<i className="far fa-star"></i>}
                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                            fullIcon={<i className="fa fa-star"></i>}
                            activeColor="#ffd700"
                            value={articles?.rating}
                            edit={false}
                          />
                        </p>
                      </div>
                      <div className="flex flex-col justify-stretch text-white italic">
                        {articles?.category}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          NOT_FOUND
        )}
      </div>
    </div>
  );
}
