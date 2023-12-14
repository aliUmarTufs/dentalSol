import { Markup } from "interweave";
import _ from "lodash";

export default function HeroSection({
  title,
  heroImg,
  descOne,
  descTwo,
  desc,
}) {
  return (
    <div className="flex flex-col lg:flex-col items-stretch lg:items-center justify-between">
      <div className="flex flex-col flex-4 lg:ml-4">
        <h1 className="font-extrabold font-poppins text-blackish-700 text-2xl leading-relaxed md:leading-relaxed sm:text-6xl sm:leading-relaxed xl:leading-relaxed xl:text-6xl">
          <img
            src={"/quote-img.png"}
            alt={"Quotation Icon"}
            className={"inline-block ml-0 mr-4 md:mr-8 lg:mx-8 md:w-auto w-8"}
          />
          {title}
        </h1>

        {!_.isNull(desc) && !_.isUndefined(desc) ? (
          <p className="descriptionText flex justify-center font-medium font-poppins text-blackish-700 text-base leading-relaxed my-2 w-full">
            {desc()}
          </p>
        ) : (
          // <Markup
          //   content={desc}
          //   className="font-medium font-poppins text-blackish-700 text-base leading-relaxed my-2 w-11/12"
          // />
          ""
        )}

        {!_.isNull(descTwo) && !_.isUndefined(descTwo) ? (
          <p className="descriptionText flex justify-center text-2xl font-extrabold font-poppins text-blackish-700 leading-relaxed my-2 w-full ">
            <Markup content={descTwo} />{" "}
          </p>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-3 justify-center lg:justify-end md-6 md:mt-6">
        <img src={heroImg} alt={title} className={"w-2/3 lg:w-72"} />
      </div>
    </div>
  );
}
