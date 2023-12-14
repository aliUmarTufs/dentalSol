import Slider from "react-slick/lib/slider";
import _ from "lodash";
import { courseSliderSettings, NOT_FOUND, ROUTES } from "../../constants";
import ReactStars from "react-stars";
import Link from "next/link";

export default function Related({ relatedCourses }) {
	if (relatedCourses?.length < 3) {
		if (relatedCourses?.length != 0) {
			courseSliderSettings.slidesToShow = relatedCourses.length;
		}
	} else {
		courseSliderSettings.slidesToShow = 3;
	}
	return (
		<div className="mt-8 mb-4">
			<h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
				Related Courses
			</h2>
			<div className="flex gap-16 w-full">
				{!_.isEmpty(relatedCourses) ? (
					<Slider
						{...courseSliderSettings}
						className={"w-full courseSliderWrap"}>
						{relatedCourses.map((courseInfo) => (
							<div key={courseInfo.id}>
								<div className="bg-wcourseInfoe px-4 py-5 border sm:rounded-lg sm:px-6 mb-8 sm:mb-4 flex flex-col justify-around h-80 w-full md:w-11/12">
									<h2
										id="timeline-title"
										className="text-md font-medium text-gray-900">
										{courseInfo.title}
									</h2>
									<p className="font-regular text-sm mt-3 md:truncate">
										{courseInfo.short_description}
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
													value={courseInfo?.rating}
													edit={false}
												/>
											</p>
										</div>
										<div className="flex flex-col justify-stretch">
											<Link
												href={`${ROUTES.COURSES}/${courseInfo.id}`}
												key={courseInfo.id}>
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
