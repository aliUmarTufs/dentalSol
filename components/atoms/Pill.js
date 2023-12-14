const colorMap = {
	blue: ["bg-blue-100", "text-blue-800"],
	green: ["bg-green-100", "text-green-800"],
};

export default function Pill({ color = "blue", className = "", children }) {
	const [bg, text] = colorMap[color];
	return (
		<div
			className={`${bg} ${text}  px-3 py-0.5 w-64 h-8 flex items-center rounded-full text-sm font-medium ${className}`}>
			{children}
		</div>
	);
}

export const PillSkeleton = ({ className }) => {
	return (
		<div
			className={`bg-gray-300 animate-pulse inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium w-20 h-6 ${className}`}
		/>
	);
};
