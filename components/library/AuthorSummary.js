const fallbackImg =
	"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80";

export default function AuthorSummary({
	author = {},
	time_published,
	className = "",
	size = "small",
	color = "black",
}) {
	let imgSize, text;
	switch (size) {
		case "medium":
			imgSize = 20;
			text = "lg";
			break;
		default:
			imgSize = 10;
			text = "sm";
	}
	const textColor = color === "white" ? "white" : "grey-500";
	const publishedDate = new Date(time_published);
	const publishedDateStr = publishedDate.toLocaleDateString(undefined, {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "2-digit",
	});
	const { first_name, last_name, picture } = author;

	return (
		<div className={`mt-6 flex items-center ${className}`}>
			<div className="flex-shrink-0">
				<a href="#">
					<span className="sr-only">John Doe</span>
					<div
						className={`h-12 w-12 sm:h-20 sm:w-20 bg-cover bg-center rounded-full`}
						style={{ backgroundImage: `url('${picture || fallbackImg}')` }}>
						&nbsp;
					</div>
				</a>
			</div>
			<div className="ml-3">
				<p className={`text-${text} font-medium text-${textColor}`}>
					{first_name} {last_name}
				</p>
				<div className={`flex space-x-1 text-sm sm:text-${text} text-${textColor}`}>
					<span>{publishedDateStr}</span>
					<span aria-hidden="true">&middot;</span>
					<span>5 min read</span>
				</div>
			</div>
		</div>
	);
}

export function AuthorSummarySkeleton({
	className = "",
	size = "small",
	color = "black",
}) {
	let imgSize, text;
	switch (size) {
		case "medium":
			imgSize = 20;
			text = "lg";
			break;
		default:
			imgSize = 10;
			text = "sm";
	}
	const textColor = color === "white" ? "white" : "gray-300";

	return (
		<div className={`mt-6 w-96 flex items-center animate-pulse ${className}`}>
			<div
				className={`bg-${textColor} w-${imgSize} h-${imgSize} rounded-full`}></div>
			<div className="ml-3 w-1/2">
				<div className={`bg-${textColor} w-full h-4 mb-1`} />
				<div className={`flex space-x-1 text-${text} text-${textColor}`}>
					<div className={`bg-${textColor} w-10 h-4`} />
					<span aria-hidden="true">&middot;</span>
					<div className={`bg-${textColor} w-10 h-4`} />
				</div>
			</div>
		</div>
	);
}
