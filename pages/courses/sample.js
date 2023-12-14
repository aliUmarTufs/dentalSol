import { Navbar, Footer, Reviews } from "../../components";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import { RadioGroup } from "@headlessui/react";
import { GlobeIcon, CurrencyDollarIcon } from "@heroicons/react/solid";
const policies = [
	{
		name: "International delivery",
		icon: GlobeIcon,
		description: "Get your order in 2 years",
	},
	{
		name: "Loyalty rewards",
		icon: CurrencyDollarIcon,
		description: "Don't look at other burs",
	},
];

const product = {
	name: "Dentsply Sirona Bur Kit",
	price: "$192",
	href: "#",
	breadcrumbs: [
		{ id: 1, name: "Men", href: "#" },
		{ id: 2, name: "Clothing", href: "#" },
	],
	images: [
		{
			src: "https://straussdiamond.com/wp-content/uploads/2016/09/856-016C-768x768-1.jpg",
		},
		{
			src: "https://www.sswhitedental.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/8/18170-surgicalprocedureskit_1.jpg",
		},
		{
			src: "https://i0.wp.com/sharkind.com/wp-content/uploads/2020/09/16016_c_dmoe-scaled.jpg?fit=2560%2C2560&ssl=1",
		},
		{
			src: "https://sc04.alicdn.com/kf/HTB1Pxy0CH1YBuNjSszhq6AUsFXaz.jpg",
		},
	],
	colors: [
		{ name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
		{ name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
		{ name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
	],
	sizes: [
		{ name: "XXS", inStock: false },
		{ name: "XS", inStock: true },
		{ name: "S", inStock: true },
		{ name: "M", inStock: true },
		{ name: "L", inStock: true },
		{ name: "XL", inStock: true },
		{ name: "2XL", inStock: true },
		{ name: "3XL", inStock: true },
	],
	description:
		"The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: 'Black'. Need to add an extra pop of color to your outfit? Our white tee has you covered.",
	highlights: ["Fine diamond tips"],
	details:
		"Limited edition of your product features hand crafted high quality element. Buy today at yoursite.com",
};
const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Example() {
	const [selectedColor, setSelectedColor] = useState(product.colors[0]);
	const [selectedSize, setSelectedSize] = useState(product.sizes[2]);

	return (
		<div className="bg-white">
			<Navbar />
			<div className="pt-6">
				{/* Image gallery */}
				<div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
					<div className="hidden aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
						<img
							src={product.images[0].src}
							alt={product.images[0].alt}
							className="w-full h-full object-center object-cover"
						/>
					</div>
					<div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
						<div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
							<img
								src={product.images[1].src}
								alt={product.images[1].alt}
								className="w-full h-full object-center object-cover"
							/>
						</div>
						<div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
							<img
								src={product.images[2].src}
								alt={product.images[2].alt}
								className="w-full h-full object-center object-cover"
							/>
						</div>
					</div>
					<div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4">
						<img
							src={product.images[3].src}
							alt={product.images[3].alt}
							className="w-full h-full object-center object-cover"
						/>
					</div>
				</div>

				{/* Product info */}
				<div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
					<div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
						<h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
							{product.name}
						</h1>
					</div>

					{/* Options */}
					<div className="mt-4 lg:mt-0 lg:row-span-3">
						<h2 className="sr-only">Product information</h2>
						<p className="text-3xl text-gray-900">{product.price}</p>

						{/* Reviews */}
						<div className="mt-6">
							<h3 className="sr-only">Reviews</h3>
							<div className="flex items-center">
								<div className="flex items-center">
									{[0, 1, 2, 3, 4].map((rating) => (
										<StarIcon
											key={rating}
											className={classNames(
												reviews.average > rating
													? "text-gray-900"
													: "text-gray-200",
												"h-5 w-5 flex-shrink-0"
											)}
											aria-hidden="true"
										/>
									))}
								</div>
								<p className="sr-only">{reviews.average} out of 5 stars</p>
								<a
									href={reviews.href}
									className="ml-3 text-sm font-medium text-blue-600 hover:text-blue-500">
									{reviews.totalCount} reviews
								</a>
							</div>
						</div>

						<form className="mt-10">
							{/* Colors */}
							<div>
								<h3 className="text-sm text-gray-900 font-medium">Color</h3>

								<RadioGroup
									value={selectedColor}
									onChange={setSelectedColor}
									className="mt-4">
									<RadioGroup.Label className="sr-only">
										Choose a color
									</RadioGroup.Label>
									<div className="flex items-center space-x-3">
										{product.colors.map((color) => (
											<RadioGroup.Option
												key={color.name}
												value={color}
												className={({ active, checked }) =>
													classNames(
														color.selectedClass,
														active && checked ? "ring ring-offset-1" : "",
														!active && checked ? "ring-2" : "",
														"-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
													)
												}>
												<RadioGroup.Label as="p" className="sr-only">
													{color.name}
												</RadioGroup.Label>
												<span
													aria-hidden="true"
													className={classNames(
														color.class,
														"h-8 w-8 border border-black border-opacity-10 rounded-full"
													)}
												/>
											</RadioGroup.Option>
										))}
									</div>
								</RadioGroup>
							</div>

							{/* Sizes */}
							<div className="mt-10">
								<div className="flex items-center justify-between">
									<h3 className="text-sm text-gray-900 font-medium">Size</h3>
									<a
										href="#"
										className="text-sm font-medium text-blue-600 hover:text-blue-500">
										Size guide
									</a>
								</div>

								<RadioGroup
									value={selectedSize}
									onChange={setSelectedSize}
									className="mt-4">
									<RadioGroup.Label className="sr-only">
										Choose a size
									</RadioGroup.Label>
									<div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
										{product.sizes.map((size) => (
											<RadioGroup.Option
												key={size.name}
												value={size}
												disabled={!size.inStock}
												className={({ active }) =>
													classNames(
														size.inStock
															? "bg-white shadow-sm text-gray-900 cursor-pointer"
															: "bg-gray-50 text-gray-200 cursor-not-allowed",
														active ? "ring-2 ring-blue-500" : "",
														"group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
													)
												}>
												{({ active, checked }) => (
													<>
														<RadioGroup.Label as="p">
															{size.name}
														</RadioGroup.Label>
														{size.inStock ? (
															<div
																className={classNames(
																	active ? "border" : "border-2",
																	checked
																		? "border-blue-500"
																		: "border-transparent",
																	"absolute -inset-px rounded-md pointer-events-none"
																)}
																aria-hidden="true"
															/>
														) : (
															<div
																aria-hidden="true"
																className="absolute -inset-px rounded-md border-2 border-gray-200 pointer-events-none">
																<svg
																	className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
																	viewBox="0 0 100 100"
																	preserveAspectRatio="none"
																	stroke="currentColor">
																	<line
																		x1={0}
																		y1={100}
																		x2={100}
																		y2={0}
																		vectorEffect="non-scaling-stroke"
																	/>
																</svg>
															</div>
														)}
													</>
												)}
											</RadioGroup.Option>
										))}
									</div>
								</RadioGroup>
							</div>

							<button
								type="submit"
								className="mt-10 w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								View on Dentsply &rarr;
							</button>
						</form>
					</div>

					<div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
						{/* Description and details */}
						<div>
							<h3 className="sr-only">Description</h3>

							<div className="space-y-6">
								<p className="text-base text-gray-900">{product.description}</p>
							</div>
						</div>

						<div className="mt-10">
							<h3 className="text-sm font-medium text-gray-900">Highlights</h3>

							<div className="mt-4">
								<ul role="list" className="pl-4 list-disc text-sm space-y-2">
									{product.highlights.map((highlight) => (
										<li key={highlight} className="text-gray-400">
											<span className="text-gray-600">{highlight}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="mt-10">
							<h2 className="text-sm font-medium text-gray-900">Details</h2>

							<div className="mt-4 space-y-6">
								<p className="text-sm text-gray-600">{product.details}</p>
							</div>
						</div>

						<div className="mt-10">
							<h2 className="text-sm font-medium text-gray-900">Perks</h2>

							<div className="mt-4 space-y-6">
								<dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
									{policies.map((policy) => (
										<div
											key={policy.name}
											className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
											<dt>
												<policy.icon
													className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400"
													aria-hidden="true"
												/>
												<span className="mt-4 text-sm font-medium text-gray-900">
													{policy.name}
												</span>
											</dt>
											<dd className="mt-1 text-sm text-gray-500">
												{policy.description}
											</dd>
										</div>
									))}
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Reviews />
			<Footer />
		</div>
	);
}
