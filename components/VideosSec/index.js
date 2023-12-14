import { PlayIcon, StarIcon } from "@heroicons/react/solid";
import Slider from "react-slick/lib/slider";
import { classNames, courseSliderSettings, NOT_FOUND } from "../../constants";
import _ from "lodash";
export default function VideosSec() {
  courseSliderSettings.slidesToShow = 3;
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
        Related Videos
      </h2>
      <div className="flex gap-16 w-full">
        {/* {!_.isEmpty(articles) ? ( */}
        <Slider {...courseSliderSettings} className={"w-full courseSliderWrap"}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((articles) => (
            <div key={articles?.id}>
              <div className="bg-wcourseInfoe relative border sm:rounded-lg flex flex-1 flex-col justify-around h-80 w-full md:w-11/12">
                <div className="w-full h-full absolute bg-blackish-300"></div>
                <PlayIcon />
                <div
                  className={"absolute w-full h-auto left-0 right-0 bottom-10 px-6"}
                >
                  <h2
                    id="timeline-title"
                    className="text-md font-medium text-white capitalize"
                  >
                    video title
                  </h2>

                  <p className="font-regular text-sm mt-3 text-white truncate">
                    {articles?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        {/* ) : (
          NOT_FOUND
        )} */}
      </div>
    </div>
  );
}
