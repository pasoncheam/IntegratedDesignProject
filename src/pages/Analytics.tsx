import { useMemo, useEffect, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloodAlert from "@/components/FloodAlert";
import RainMeter from "@/components/RainMeter";
import TempHumidity from "@/components/TempHumidity";
import { useCSVReadings } from "@/hooks/useCSVReadings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { Info, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const ANTHROPIC_EXPLANATION = (
	<div className="space-y-4 text-sm text-muted-foreground">
		<p>
			Our system employs a <strong>Champion Model Strategy</strong> to ensure the highest accuracy for flood prediction.
		</p>
		<div className="space-y-2">
			<p className="font-semibold text-foreground">How it works:</p>
			<ol className="list-decimal list-inside space-y-2 ml-2">
				<li>
					<strong>Training:</strong> We continuously train 4 AI models:
					<ul className="list-disc list-inside ml-4 mt-1 opacity-90">
						<li>Logistic Regression</li>
						<li>Decision Tree</li>
						<li>Support Vector Machine (SVM)</li>
						<li>Deep Learning</li>
					</ul>
				</li>
				<li>
					<strong>Evaluation:</strong> After every training cycle, we evaluate each model's performance against the latest data.
				</li>
				<li>
					<strong>Selection:</strong> The model with the highest accuracy score is virtually crowned the <em>"Champion"</em>.
				</li>
				<li>
					<strong>Prediction:</strong> Your live flood risk prediction is generated exclusively by this Champion model.
				</li>
			</ol>
		</div>
		<p>
			This ensures that our analysis adapts to changing conditions and always uses the smartest available brain for the job.
		</p>
	</div>
);

const DISCLAIMER_EXPLANATION = (
	<div className="space-y-4 text-sm text-muted-foreground">
		<p>
			Please note that the AI models and flood risk analysis provided on this website are currently in a <strong>preliminary development stage</strong>.
		</p>
		<div className="space-y-2">
			<p className="font-semibold text-foreground">Important Considerations:</p>
			<ul className="list-disc list-inside space-y-2 ml-2">
				<li>
					<strong>Not Nationally Recognized:</strong> This system is not yet accredited or recognized by national meteorological or geological agencies.
				</li>
				<li>
					<strong>Experimental Nature:</strong> The predictions are based on academic research and experimental data processing techniques.
				</li>
				<li>
					<strong>Use with Caution:</strong> While we strive for accuracy, this information should be used as a supplementary reference and not as the sole basis for critical safety decisions. Always refer to official government warnings for authoritative information.
				</li>
			</ul>
		</div>
	</div>
);

const InfoPopupContent = () => {
	const [page, setPage] = useState(0);

	return (
		<>
			<DialogHeader>
				<DialogTitle>{page === 0 ? "How Our AI Analysis Works" : "Disclaimer & Limitations"}</DialogTitle>
				<DialogDescription>
					{page === 0 ? "Understanding the \"Champion\" Model Strategy" : "Important information about the system status"}
				</DialogDescription>
			</DialogHeader>

			<div className="flex-1">
				{page === 0 ? ANTHROPIC_EXPLANATION : DISCLAIMER_EXPLANATION}
			</div>

			<div className="flex justify-end gap-2 mt-4">
				{page > 0 && (
					<Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)}>
						Previous
					</Button>
				)}
				{page === 0 && (
					<Button size="sm" onClick={() => setPage((p) => p + 1)}>
						Next
					</Button>
				)}
			</div>
		</>
	);
};

const WATER_LEVEL_THRESHOLDS = {
	safe: 50,
	warning: 100,
	danger: 150,
};

const RAINFALL_THRESHOLDS = {
	light: 5,
	moderate: 20,
	heavy: 50,
};

const HUMIDITY_RANGE = {
	min: 40,
	max: 80,
};

type ChartDatum = {
	label: string;
	timestamp: number;
	waterLevel?: number;
	rainfall?: number;
	humidity?: number;
	temperature?: number;
};

interface PredictionResult {
	timestamp: string;
	prediction: number;
	probability: number | null;
	model_used: string;
	model_accuracy: number;
	input_data: {
		rainfall: number;
		humidity: number;
		temperature: number;
		water_level: number;
	};
}

const chartSections = [
	{
		key: "waterLevel" as const,
		title: "Water Level",
		description: "River height measured in centimetres",
		color: "#2563eb",
		unit: "cm",
		referenceLines: [
			{ value: WATER_LEVEL_THRESHOLDS.safe, color: "#22c55e", label: "Safe" },
			{ value: WATER_LEVEL_THRESHOLDS.warning, color: "#eab308", label: "Warning" },
			{ value: WATER_LEVEL_THRESHOLDS.danger, color: "#ef4444", label: "Danger" },
		],
	},
	{
		key: "rainfall" as const,
		title: "Rainfall",
		description: "Precipitation intensity in millimetres",
		color: "#0ea5e9",
		unit: "mm",
		referenceLines: [
			{ value: RAINFALL_THRESHOLDS.light, color: "#22c55e", label: "Light" },
			{ value: RAINFALL_THRESHOLDS.moderate, color: "#eab308", label: "Moderate" },
			{ value: RAINFALL_THRESHOLDS.heavy, color: "#ef4444", label: "Heavy" },
		],
	},
	{
		key: "humidity" as const,
		title: "Humidity",
		description: "Relative humidity percentage",
		color: "#14b8a6",
		unit: "%",
	},
	{
		key: "temperature" as const,
		title: "Temperature",
		description: "Ambient air temperature near the station",
		color: "#f43f5e",
		unit: "°C",
	},
];

const Analytics = () => {
	const { data: csvReadings, loading: csvLoading, error: csvError } = useCSVReadings();

	// Use the CSV data directly for charts
	const readingsForCharts = csvReadings;

	// Get the latest reading from the CSV data
	const latestReading = readingsForCharts.length > 0 ? readingsForCharts[readingsForCharts.length - 1] : undefined;

	// We no longer need complex buffering logic because the CSV provides the full dataset we want to show.
	// However, we might want to filter for the last 24 hours if the CSV contains more than that,
	// although the Python script limits it to 1001 rows which is roughly 1 week of data at 10 min intervals.
	// The existing chart logic filters by `rangeHours` anyway.



	// calculate data for the charts
	const chartData = useMemo<ChartDatum[]>(() => {
		if (!readingsForCharts.length) return [];

		const now = Date.now();

		// Use all available data from the CSV
		const filtered = readingsForCharts;

		// If timestamps are old or not epoch-based (e.g. device millis),
		// fall back to showing the latest reading as "Now" so the chart
		// never appears empty when we do have live data.
		if (!filtered.length) {
			const latest = readingsForCharts.at(-1)!;
			return [
				{
					label: "Now",
					timestamp: now,
					waterLevel: typeof latest.waterLevel === "number" ? latest.waterLevel : undefined,
					rainfall: typeof latest.rainfall === "number" ? latest.rainfall : undefined,
					humidity: typeof latest.humidity === "number" ? latest.humidity : undefined,
					temperature: typeof latest.temperature === "number" ? latest.temperature : undefined,
				},
			];
		}

		const mapped = filtered.map((reading) => {
			return {
				label: new Date(reading.timestamp).toLocaleTimeString(undefined, {
					hour: "2-digit",
					minute: "2-digit",
				}),
				timestamp: reading.timestamp,
				waterLevel: typeof reading.waterLevel === "number" ? reading.waterLevel : undefined,
				rainfall: typeof reading.rainfall === "number" ? reading.rainfall : undefined,
				humidity: typeof reading.humidity === "number" ? reading.humidity : undefined,
				temperature: typeof reading.temperature === "number" ? reading.temperature : undefined,
			};
		});

		return mapped;
	}, [readingsForCharts]);

	// --- Environmental Insight state & fetch logic ---
	const [prediction, setPrediction] = useState<PredictionResult | null>(null);
	const [insightLoading, setInsightLoading] = useState(false);
	const [insightError, setInsightError] = useState<string | null>(null);

	// Download state for Excel export
	const [downloadLoading, setDownloadLoading] = useState(false);

	// Compile chart data + current prediction into an Excel file and trigger download.
	async function handleDownloadExcel() {
		if (downloadLoading) return;
		setDownloadLoading(true);
		try {
			// dynamically import sheetjs
			const mod = await import("xlsx");
			// module may be default-exported
			const XLSX = (mod && (mod as any).default) ? (mod as any).default : mod;

			// Prepare rows from chartData (preserve types)
			const rows = chartData.map((d) => {
				const dateObj = new Date(d.timestamp);
				const isValidDate = !isNaN(dateObj.getTime());
				return {
					timestamp: isValidDate ? dateObj.toISOString() : "Invalid Date",
					label: d.label ?? "",
					waterLevel: typeof d.waterLevel === "number" ? d.waterLevel : "",
					rainfall: typeof d.rainfall === "number" ? d.rainfall : "",
					humidity: typeof d.humidity === "number" ? d.humidity : "",
					temperature: typeof d.temperature === "number" ? d.temperature : "",
				};
			});

			// Create workbook
			const wb = XLSX.utils.book_new();
			// Readings sheet
			const ws = XLSX.utils.json_to_sheet(rows);
			XLSX.utils.book_append_sheet(wb, ws, "Readings");

			// Insight sheet (Prediction)
			if (prediction) {
				const predictionData = [
					["AI Flood Analysis Report"],
					["Timestamp", prediction.timestamp],
					["Prediction", prediction.prediction === 1 ? "FLOOD RISK" : "NO FLOOD RISK"],
					["Model Used", prediction.model_used],
					["Model Accuracy", `${(prediction.model_accuracy * 100).toFixed(1)}%`],
					["Input Rainfall (mm)", prediction.input_data.rainfall],
					["Input Water Level (cm)", prediction.input_data.water_level],
					["Input Humidity (%)", prediction.input_data.humidity],
					["Input Temperature (°C)", prediction.input_data.temperature]
				];
				const insightSheet = XLSX.utils.aoa_to_sheet(predictionData);
				XLSX.utils.book_append_sheet(wb, insightSheet, "Analysis");
			} else {
				const insightSheet = XLSX.utils.aoa_to_sheet([["AI Analysis"], ["No prediction available yet."]]);
				XLSX.utils.book_append_sheet(wb, insightSheet, "Analysis");
			}

			// Write workbook to binary array and download
			const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
			const blob = new Blob([wbout], { type: "application/octet-stream" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `environment_data_${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error(err);
			// We don't have a place to show download error in UI easily for top button, just log
			alert("Failed to generate Excel.");
		} finally {
			setDownloadLoading(false);
		}
	}

	// Fetch the latest ML prediction
	// get the latest flood prediction from ai
	useEffect(() => {
		setInsightLoading(true);
		// Prepend base URL to fetching from public folder in production
		const baseUrl = import.meta.env.BASE_URL.endsWith('/')
			? import.meta.env.BASE_URL
			: `${import.meta.env.BASE_URL}/`;

		fetch(`${baseUrl}latest_flood_risk.json`)
			.then(res => {
				if (!res.ok) throw new Error("Failed to fetch prediction");
				return res.json();
			})
			.then((data: PredictionResult) => {
				setPrediction(data);
				setInsightLoading(false);
			})
			.catch(err => {
				console.error("Error fetching flood risk:", err);
				setInsightError("Prediction unavailable");
				setInsightLoading(false);
			});
	}, []); // Fetch once on mount, or could poll interval
	// --- end insight logic ---
	// --- end insight logic ---

	const lastUpdatedLabel = latestReading?.timestamp
		? `Last updated ${new Date(latestReading.timestamp).toLocaleString()}`
		: "Last updated timestamp not available yet.";

	const riskAssessment = useMemo(() => {
		if (!latestReading) {
			return {
				level: "Unknown",
				color: "text-slate-500",
				message: "Waiting for live sensor readings...",
			};
		}

		const waterLevel = typeof latestReading.waterLevel === "number" ? latestReading.waterLevel : 0;
		const rainfall = typeof latestReading.rainfall === "number" ? latestReading.rainfall : 0;
		const humidity = typeof latestReading.humidity === "number" ? latestReading.humidity : 0;

		let score = 0;

		if (waterLevel >= WATER_LEVEL_THRESHOLDS.danger) score += 50;
		else if (waterLevel >= WATER_LEVEL_THRESHOLDS.warning) score += 30;
		else if (waterLevel >= WATER_LEVEL_THRESHOLDS.safe) score += 10;

		if (rainfall >= RAINFALL_THRESHOLDS.heavy) score += 40;
		else if (rainfall >= RAINFALL_THRESHOLDS.moderate) score += 25;
		else if (rainfall >= RAINFALL_THRESHOLDS.light) score += 10;

		if (humidity > HUMIDITY_RANGE.max) score += 5;

		if (score >= 70) return { level: "Critical", color: "text-red-600", message: "Immediate action recommended." };
		if (score >= 50) return { level: "High", color: "text-amber-600", message: "Prepare for potential flooding." };
		if (score >= 30) return { level: "Moderate", color: "text-yellow-600", message: "Stay alert and monitor updates." };
		return { level: "Low", color: "text-emerald-600", message: "Conditions are stable." };
	}, [latestReading]);

	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />

			<main className="flex-1 container mx-auto px-4 py-8 space-y-10">
				{prediction?.prediction === 1 && (
					<div className="bg-destructive/15 border-l-4 border-destructive p-4 rounded-r-lg flex items-start gap-4 animate-in slide-in-from-top-2">
						<TriangleAlert className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
						<div>
							<h3 className="text-lg font-bold text-destructive">FLOOD RISK ALERT</h3>
							<p className="text-destructive-foreground">
								The AI system has detected a high probability of flooding based on current sensor data.
								Please exercise caution and monitor water levels closely.
							</p>
						</div>
					</div>
				)}

				<section className="space-y-6">
					<Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-slate-800">
						<CardHeader>
							<CardTitle className="text-2xl md:text-3xl">Live Flood Risk Prediction</CardTitle>
							<p className="text-slate-200">{lastUpdatedLabel}</p>
						</CardHeader>
						<CardContent className="grid gap-6 md:grid-cols-2">

							<div className="grid gap-4">
								<div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur">
									<div>
										<p className="text-sm text-slate-300">Water Level</p>
										<p className="text-2xl font-semibold">
											{typeof latestReading?.waterLevel === "number" ? `${latestReading.waterLevel.toFixed(2)} cm` : "—"}
										</p>
									</div>
									<div>
										<p className="text-sm text-slate-300">Rainfall</p>
										<p className="text-2xl font-semibold">
											{typeof latestReading?.rainfall === "number" ? `${latestReading.rainfall.toFixed(2)} mm` : "—"}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur">
									<div>
										<p className="text-sm text-slate-300">Temperature</p>
										<p className="text-2xl font-semibold">
											{typeof latestReading?.temperature === "number" ? `${latestReading.temperature.toFixed(2)} °C` : "—"}
										</p>
									</div>
									<div>
										<p className="text-sm text-slate-300">Humidity</p>
										<p className="text-2xl font-semibold">
											{typeof latestReading?.humidity === "number" ? `${latestReading.humidity.toFixed(2)}%` : "—"}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-start justify-between space-y-0">
							<div className="space-y-1.5">
								<CardTitle>Environmental Trends</CardTitle>
								<p className="text-sm text-muted-foreground">
									Live graphs update automatically as new readings arrive.
								</p>
							</div>
							<button
								type="button"
								onClick={handleDownloadExcel}
								disabled={downloadLoading}
								className="inline-flex items-center rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
							>
								{downloadLoading ? "Preparing..." : "Download Data"}
							</button>
						</CardHeader>
						<CardContent>
							{csvError ? (
								<p className="text-sm text-red-500">Failed to load historical data: {csvError}</p>
							) : csvLoading && chartData.length === 0 ? (
								<p className="text-sm text-muted-foreground">Loading recent readings…</p>
							) : chartData.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									We&apos;re still waiting for the first batch of historical readings. Data will appear automatically.
								</p>
							) : (
								<div className="grid gap-6 md:grid-cols-2">
									{chartSections.map((section) => (
										<Card key={section.key} className="border-slate-200 dark:border-slate-800">
											<CardHeader>
												<CardTitle>{section.title}</CardTitle>
												<p className="text-sm text-muted-foreground">{section.description}</p>
											</CardHeader>
											<CardContent>
												<ChartContainer
													config={{
														[section.key]: {
															label: section.title,
															color: section.color,
														},
													}}
													className="h-64"
												>
													<AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis
															dataKey="timestamp"
															type="number"
															domain={['dataMin', 'dataMax']}
															tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
															tickLine={false}
															axisLine={false}
															label={{ value: "Time", position: "insideBottomRight", offset: -10 }}
														/>
														<YAxis
															width={50}
															tickLine={false}
															axisLine={false}
															tickFormatter={(value) => `${Number(value).toFixed(2)}`}
															label={{ value: `${section.title} (${section.unit})`, angle: -90, position: "insideLeft", style: { textAnchor: 'middle' } }}
														/>
														<ChartTooltip content={<ChartTooltipContent />} />
														{section.referenceLines?.map((refLine) => (
															<ReferenceLine
																key={`${section.key}-${refLine.value}`}
																y={refLine.value}
																label={{ value: refLine.label, position: "right", fill: refLine.color }}
																stroke={refLine.color}
																strokeDasharray="4 4"
															/>
														))}
														<Area
															type="monotone"
															dataKey={section.key}
															stroke={`var(--color-${section.key})`}
															fill={`var(--color-${section.key})`}
															fillOpacity={0.15}
															strokeWidth={2.2}
															activeDot={{ r: 5 }}
														/>
													</AreaChart>
												</ChartContainer>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* AI-generated Environmental Insight - placed immediately below the graphs */}
					{/* Machine Learning Prediction Result */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<CardTitle>AI Flood Risk Analysis</CardTitle>
								<Dialog>
									<DialogTrigger asChild>
										<button className="inline-flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2" aria-label="Learn more about AI Analysis">
											<Info className="h-4 w-4 text-muted-foreground" />
										</button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-md">
										<InfoPopupContent />
									</DialogContent>
								</Dialog>
							</div>
							<p className="text-sm text-muted-foreground">Real-time prediction using {prediction?.model_used ?? "Machine Learning"}</p>
						</CardHeader>
						<CardContent>
							{insightLoading ? (
								<p className="text-sm text-muted-foreground">Analyzing data...</p>
							) : prediction ? (
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<div className={`text-3xl font-bold ${prediction.prediction === 1 ? "text-red-500" : "text-emerald-500"}`}>
											{prediction.prediction === 1 ? "FLOOD RISK DETECTED" : "NO FLOOD RISK DETECTED"}
										</div>
										<p className="text-sm text-slate-400">
											Accuracy: {(prediction.model_accuracy * 100).toFixed(1)}%
										</p>
									</div>
									<div className="text-sm text-black bg-slate-100 p-4 rounded-lg">
										<p className="font-semibold mb-2">Analysis Data ({prediction.timestamp}):</p>
										<ul className="grid grid-cols-2 gap-2">
											<li>Rainfall: {prediction.input_data.rainfall.toFixed(2)} mm</li>
											<li>Water Level: {prediction.input_data.water_level.toFixed(2)} cm</li>
											<li>Humidity: {prediction.input_data.humidity.toFixed(1)}%</li>
											<li>Temperature: {prediction.input_data.temperature.toFixed(1)}°C</li>
										</ul>
									</div>
								</div>
							) : insightError ? (
								<p className="text-sm text-red-500">{insightError}</p>
							) : (
								<p className="text-sm text-muted-foreground">Waiting for analysis...</p>
							)}
						</CardContent>
					</Card>
				</section >

				<FloodAlert
					waterLevel={typeof latestReading?.waterLevel === "number" ? latestReading.waterLevel : 0}
					timestamp={latestReading?.timestamp}
				/>

				<div className="grid grid-cols-1 gap-8 mb-12">
					<RainMeter rainfall={typeof latestReading?.rainfall === "number" ? latestReading.rainfall : 0} />
				</div>

				{
					typeof latestReading?.temperature === "number" && typeof latestReading?.humidity === "number" ? (
						<div className="mb-12 grid gap-4 md:grid-cols-2">
							{/* Temperature card - standard styling */}
							<Card className="rounded-2xl">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Temperature Reading</CardTitle>
											<p className="text-sm text-muted-foreground">Current ambient temperature</p>
										</div>
										<Dialog>
											<DialogTrigger asChild>
												<button className="inline-flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
													<Info className="h-4 w-4 text-muted-foreground" />
												</button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Temperature Information</DialogTitle>
													<DialogDescription>
														Details about temperature measurement.
													</DialogDescription>
												</DialogHeader>
												<div className="text-sm text-muted-foreground space-y-2">
													<p><strong>Daily Mean Temperature:</strong> 28°C (Medium: 26-30°C)</p>
													<p><strong>Daily Minimum:</strong> 23°C (Low: 23-26°C)</p>
													<p><strong>Daily Maximum:</strong> 32°C (High: &gt;30°C)</p>
													<div className="pt-2 text-xs border-t">
														<p className="font-semibold mb-1">Sources:</p>
														<ul className="list-disc pl-4 space-y-1">
															<li><a href="https://doi.org/10.1080/22797254.2018.1542976" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">DOI: 10.1080 (2018)</a></li>
															<li><a href="https://weatherspark.com/y/113829/Average-Weather-in-Kuala-Lumpur-Malaysia-Year-Round" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">WeatherSpark KL</a></li>
														</ul>
													</div>
												</div>
											</DialogContent>
										</Dialog>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-slate-300">Temperature</p>
											<p className="text-2xl font-semibold text-primary">
												{typeof latestReading?.temperature === "number" ? `${latestReading.temperature.toFixed(2)} °C` : "—"}
											</p>
										</div>
										<div className="text-sm text-slate-400">
											{new Date(latestReading?.timestamp ?? Date.now()).toLocaleTimeString()}
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Humidity card - standard styling */}
							<Card className="rounded-2xl">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Humidity Reading</CardTitle>
											<p className="text-sm text-muted-foreground">Relative humidity</p>
										</div>
										<Dialog>
											<DialogTrigger asChild>
												<button className="inline-flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
													<Info className="h-4 w-4 text-muted-foreground" />
												</button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Humidity Information</DialogTitle>
													<DialogDescription>
														Details about humidity measurement.
													</DialogDescription>
												</DialogHeader>
												<div className="text-sm text-muted-foreground space-y-2">
													<p><strong>High:</strong> Above 65% (Risk of mold, above ASHRAE 55 max comfort)</p>
													<p><strong>Low:</strong> Below 30% (Discomfort, rare in Malaysia)</p>
													<p><strong>Comfortable:</strong> &lt;55% (ASHRAE 55) or 40-70% (MS 1525)</p>
													<p><strong>Annual Average:</strong> 70-90% (Monthly min avg ~56%)</p>
													<div className="pt-2 text-xs border-t">
														<p className="font-semibold mb-1">Sources:</p>
														<ul className="list-disc pl-4 space-y-1">
															<li><a href="https://www.planningmalaysia.org/index.php/pmj/article/download/1808/1484/2784" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Planning Malaysia Journal</a></li>
															<li><a href="https://doi.org/10.1080/22797254.2018.1542976" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">DOI: 10.1080 (2018)</a></li>
														</ul>
													</div>
												</div>
											</DialogContent>
										</Dialog>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-slate-300">Humidity</p>
											<p className="text-2xl font-semibold text-primary">
												{typeof latestReading?.humidity === "number" ? `${latestReading.humidity.toFixed(2)}%` : "—"}
											</p>
										</div>
										<div className="text-sm text-slate-400">
											{new Date(latestReading?.timestamp ?? Date.now()).toLocaleTimeString()}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					) : null
				}
			</main >

			<Footer />
		</div >
	);
};

export default Analytics;
