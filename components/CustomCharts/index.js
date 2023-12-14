import { Bar, Line } from "react-chartjs-2";
/* Import Controllers, Elements, etc. which will use by charts */
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	BarElement,
} from "chart.js";

/* Register all imports from chart.js */
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	BarElement
);

export default function CustomCharts({
	chartTitle,
	chartData,
	chartType,
	chartOptions,
}) {
	return (
		<div
			className="overflow-hidden p-5 rounded-lg bg-white"
			style={{
				// boxShadow:
				// 	"0px 1.06099px 3.18297px rgba(0, 0, 0, 0.1), 0px 1.06099px 2.12198px rgba(0, 0, 0, 0.06)",
				boxShadow:
					"0px 0.715954px 2.14786px rgba(0, 0, 0, 0.1), 0px 0.715954px 1.43191px rgba(0, 0, 0, 0.06)",
			}}>
			<div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-neutral-200">
				{chartTitle}
			</div>

			{chartType === "line" ? (
				<Line data={chartData} options={chartOptions} height={100} />
			) : (
				<Bar data={chartData} options={chartOptions} height={150} />
			)}
		</div>
	);
}
