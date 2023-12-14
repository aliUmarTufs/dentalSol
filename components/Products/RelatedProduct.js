import Slider from "react-slick/lib/slider";
import _ from "lodash";
import { productSliderSettings, NOT_FOUND, ROUTES, courseSliderSettings } from "../../constants";
import ReactStars from "react-stars";
import Link from "next/link";

import { StarIcon } from "@heroicons/react/solid";

export default function RelatedProduct({ relatedProducts }) {
  return (
    <div className="mt-8 mb-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Related Products
        </h2>{" "}
        {!_.isEmpty(relatedProducts) ? (
          <Slider
            {...courseSliderSettings}
            className={"w-full productSliderWrap"}
          >
            {relatedProducts.map((productInfo) => (
              <div key={productInfo.id}>
                <div className="bg-wcourseInfoe px-4 py-5 border sm:rounded-lg sm:px-6 mb-8 sm:mb-4 flex flex-col justify-around h-80 w-full md:w-11/12">
                  <div className="flex items-center gap-4">
                    {_.isEmpty(productInfo.thumbnail) ? (
                      ""
                    ) : (
                      <img
                        className="w-12 h-12 object-cover rounded-full"
                        src={productInfo.thumbnail}
                        alt={productInfo.name}
                      />
                    )}
                    <h2
                      id="timeline-title"
                      className="text-md font-medium text-gray-900"
                    >
                      {productInfo.name}
                    </h2>
                  </div>

                  <p className="font-regular text-sm mt-3 truncate">
                    {productInfo.short_description}
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
                          value={productInfo?.rating}
                          edit={false}
                        />
                      </p>
                    </div>
                    <div className="flex flex-col justify-stretch">
                      <Link
                        href={`${ROUTES.PRODUCTS}/${productInfo.id}`}
                        key={productInfo.id}
                      >
                        <a className="font-semibold text-sm text-blue-600">
                          View &rarr;
                        </a>
                      </Link>
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
