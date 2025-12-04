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
		referenceLines: [
			{ value: HUMIDITY_RANGE.min, color: "#eab308", label: "Low" },
			{ value: HUMIDITY_RANGE.max, color: "#eab308", label: "High" },
		],
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



	const chartData = useMemo<ChartDatum[]>(() => {
		if (!readingsForCharts.length) return [];

		const now = Date.now();
		const oneDayAgo = now - 24 * 60 * 60 * 1000;

		const filtered = readingsForCharts.filter((reading) => {
			const ts = typeof reading.timestamp === "number" ? reading.timestamp : now;
			return ts >= oneDayAgo;
		});

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

	// --- Environmental Insight (local heuristic) state & trigger logic ---
	const [insight, setInsight] = useState<string | null>(null);
	const [insightLoading, setInsightLoading] = useState(false);
	const [insightError, setInsightError] = useState<string | null>(null);
	const lastInsightKeyRef = useRef<string | null>(null);
	// Download state for Excel export
	const [downloadLoading, setDownloadLoading] = useState(false);

	// Compile chart data + current insight into an Excel file and trigger download.
	// Uses dynamic import of `xlsx` so the library is only loaded when user requests a download.
	async function handleDownloadExcel() {
		if (downloadLoading) return;
		setDownloadLoading(true);
		try {
			// dynamically import sheetjs
			const mod = await import("xlsx");
			// module may be default-exported
			const XLSX = (mod && (mod as any).default) ? (mod as any).default : mod;

			// Prepare rows from chartData (preserve types)
			const rows = chartData.map((d) => ({
				timestamp: new Date(d.timestamp).toISOString(),
				label: d.label ?? "",
				waterLevel: typeof d.waterLevel === "number" ? d.waterLevel : "",
				rainfall: typeof d.rainfall === "number" ? d.rainfall : "",
				humidity: typeof d.humidity === "number" ? d.humidity : "",
				temperature: typeof d.temperature === "number" ? d.temperature : "",
			}));

			// Create workbook
			const wb = XLSX.utils.book_new();
			// Readings sheet
			const ws = XLSX.utils.json_to_sheet(rows);
			XLSX.utils.book_append_sheet(wb, ws, "Readings");

			// Insight sheet (single paragraph)
			const insightText = insight ?? "No insight available.";
			const insightSheet = XLSX.utils.aoa_to_sheet([["Environmental Insight"], [insightText]]);
			XLSX.utils.book_append_sheet(wb, insightSheet, "Insight");

			// Write workbook to binary array and download
			const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
			const blob = new Blob([wbout], { type: "application/octet-stream" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `environment_insight_${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error(err);
			setInsightError("Failed to generate Excel.");
		} finally {
			setDownloadLoading(false);
		}
	}

	// Small helper: compute simple trend (first -> last) and return label and delta
	function computeTrend(values: number[]): { delta: number; trendLabel: string } {
		if (!values.length) return { delta: 0, trendLabel: "no data" };
		const first = values[0];
		const last = values[values.length - 1];
		const delta = last - first;
		const absDelta = Math.abs(delta);

		// thresholds are relative to scale; tweak for each metric in caller
		let trendLabel = "stable";
		if (absDelta === 0) trendLabel = "stable";
		else if (absDelta < 0.01 * Math.max(1, Math.abs(first))) trendLabel = "slightly changed";
		else if (absDelta < 0.05 * Math.max(1, Math.abs(first))) trendLabel = delta > 0 ? "slightly rising" : "slightly falling";
		else if (absDelta < 0.15 * Math.max(1, Math.abs(first))) trendLabel = delta > 0 ? "rising" : "falling";
		else trendLabel = delta > 0 ? "rising sharply" : "falling sharply";

		return { delta, trendLabel };
	}

	// Generate a concise 1-paragraph (multi-sentence) insight with more detail and emotion.
	function generateHeuristicInsight(latest: any, recent: ChartDatum[]): string {
		const partsCurrent: string[] = [];

		if (typeof latest.waterLevel === "number") partsCurrent.push(`water level ${latest.waterLevel} cm`);
		if (typeof latest.rainfall === "number") partsCurrent.push(`rainfall ${latest.rainfall} mm`);
		if (typeof latest.humidity === "number") partsCurrent.push(`humidity ${latest.humidity}%`);
		if (typeof latest.temperature === "number") partsCurrent.push(`temperature ${latest.temperature}°C`);

		const snapshot = partsCurrent.length ? `Right now: ${partsCurrent.join(", ")}.` : "Right now, current readings are unavailable.";

		// Prepare recent arrays
		const lastN = recent.slice(-12);
		const wl = lastN.map((r) => (typeof r.waterLevel === "number" ? r.waterLevel : NaN)).filter((v) => !Number.isNaN(v));
		const rf = lastN.map((r) => (typeof r.rainfall === "number" ? r.rainfall : NaN)).filter((v) => !Number.isNaN(v));
		const hum = lastN.map((r) => (typeof r.humidity === "number" ? r.humidity : NaN)).filter((v) => !Number.isNaN(v));
		const tmp = lastN.map((r) => (typeof r.temperature === "number" ? r.temperature : NaN)).filter((v) => !Number.isNaN(v));

		// Helper to format trend with numbers
		function fmtTrend(arr: number[], label: string) {
			if (!arr.length) return null;
			const { delta, trendLabel } = computeTrend(arr);
			const first = arr[0];
			const last = arr[arr.length - 1];
			const change = (last - first).toFixed(1);
			return `${label} is ${trendLabel} (Δ ${change}).`;
		}

		const wlTrend = fmtTrend(wl, "Water level");
		const rfTrend = fmtTrend(rf, "Rainfall");
		const humTrend = fmtTrend(hum, "Humidity");
		const tmpTrend = fmtTrend(tmp, "Temperature");

		// Averages for context
		const avg = (arr: number[]) => (arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : NaN);
		const rfAvg = avg(rf);
		const wlLast = wl.length ? wl[wl.length - 1] : NaN;

		// Interpretive sentence about implications
		let implication = "No immediate concerns detected.";
		if (!Number.isNaN(wlLast) && wlLast >= WATER_LEVEL_THRESHOLDS.danger) {
			implication = "Water level is within the danger range — immediate caution is warranted.";
		} else if (!Number.isNaN(wlLast) && wlLast >= WATER_LEVEL_THRESHOLDS.warning && !Number.isNaN(rfAvg) && rfAvg >= RAINFALL_THRESHOLDS.moderate) {
			implication = "Rising water with sustained moderate-to-heavy rainfall suggests increased flood risk — heightened monitoring strongly advised.";
		} else if (!Number.isNaN(rfAvg) && rfAvg >= RAINFALL_THRESHOLDS.heavy) {
			implication = "Heavy rainfall recently increases runoff risk; watch water level closely.";
		} else if ((hum.length && hum[hum.length - 1] > HUMIDITY_RANGE.max) || (tmp.length && tmp[tmp.length - 1] > 35)) {
			implication = "Atmospheric conditions are notable and could affect short-term behavior — stay attentive.";
		}

		// Emotional recommendation
		let recommendation = "Continue to monitor readings frequently.";
		if (implication.toLowerCase().includes("immediate") || implication.toLowerCase().includes("danger")) {
			recommendation = "Take immediate precautions and alert relevant parties — this is a serious situation.";
		} else if (implication.toLowerCase().includes("increased")) {
			recommendation = "Be vigilant over the next hours and check updates often.";
		} else if (implication.toLowerCase().includes("heavy rainfall")) {
			recommendation = "Prepare for potential runoff and keep an eye on river levels.";
		} else {
			recommendation = "Conditions seem calm but remain watchful — weather can change quickly.";
		}

		// Compose a single paragraph (3-4 sentences)
		const sentences: string[] = [];
		sentences.push(snapshot);
		const trendSentences = [wlTrend, rfTrend, humTrend, tmpTrend].filter(Boolean) as string[];
		if (trendSentences.length) sentences.push(trendSentences.join(" "));
		sentences.push(implication);
		sentences.push(recommendation);

		// Join into one paragraph and ensure it's not excessively long
		const paragraph = sentences.join(" ").replace(/\s+/g, " ").trim();
		return paragraph;
	}

	// Trigger generation only when a new reading arrives (deduplicated).
	useEffect(() => {
		if (!latestReading) return;

		const key = String(latestReading.id ?? latestReading.timestamp ?? Date.now());
		if (lastInsightKeyRef.current === key) return;
		lastInsightKeyRef.current = key;

		setInsightLoading(true);
		setInsightError(null);

		// run generation synchronously but async-style for UI
		const t = setTimeout(() => {
			try {
				const generated = generateHeuristicInsight(latestReading, chartData);
				setInsight(generated || "Insight unavailable at the moment.");
			} catch (err) {
				setInsight(null);
				setInsightError("Insight unavailable at the moment.");
			} finally {
				setInsightLoading(false);
			}
		}, 100); // tiny delay to keep UI responsive

		return () => clearTimeout(t);
	}, [latestReading, chartData]);
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
				<section className="space-y-6">
					<Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-slate-800">
						<CardHeader>
							<CardTitle className="text-2xl md:text-3xl">Live Flood Risk Prediction</CardTitle>
							<p className="text-slate-200">{lastUpdatedLabel}</p>
						</CardHeader>
						<CardContent className="grid gap-6 md:grid-cols-2">
							<div className="space-y-4">
								<p className={`text-4xl font-bold ${riskAssessment.color}`}>{riskAssessment.level}</p>
								<p className="text-slate-200">{riskAssessment.message}</p>
								<div className="text-sm text-slate-400 space-y-1">
									<p>Danger water level ≥ {WATER_LEVEL_THRESHOLDS.danger} cm</p>
									<p>Heavy rainfall ≥ {RAINFALL_THRESHOLDS.heavy} mm</p>
								</div>
							</div>
							<div className="grid gap-4">
								<div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur">
									<div>
										<p className="text-sm text-slate-300">Water Level</p>
										<p className="text-2xl font-semibold">
											{typeof latestReading?.waterLevel === "number" ? `${latestReading.waterLevel} cm` : "—"}
										</p>
									</div>
									<div>
										<p className="text-sm text-slate-300">Rainfall</p>
										<p className="text-2xl font-semibold">
											{typeof latestReading?.rainfall === "number" ? `${latestReading.rainfall} mm` : "—"}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur">
									<div>
										<p className="text-sm text-slate-300">Temperature</p>
										<p className="text-2xl font-semibold">
											{typeof latestReading?.temperature === "number" ? `${latestReading.temperature} °C` : "—"}
										</p>
									</div>
									<div>
										<p className="text-sm text-slate-300">Humidity</p>
										<p className="text-2xl font-semibold">
											{typeof latestReading?.humidity === "number" ? `${latestReading.humidity}%` : "—"}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Environmental Trends</CardTitle>
							<p className="text-sm text-muted-foreground">
								Live graphs update automatically as new readings arrive.
							</p>
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
													<AreaChart data={chartData}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis
															dataKey="label"
															tickLine={false}
															axisLine={false}
															label={{ value: "Time", position: "insideBottomRight", offset: -5 }}
														/>
														<YAxis
															unit={section.unit}
															tickLine={false}
															axisLine={false}
															label={{ value: section.unit, angle: -90, position: "insideLeft" }}
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
					<Card>
						<CardHeader>
							<CardTitle>Environmental Insight</CardTitle>
							<p className="text-sm text-muted-foreground">AI-generated summary of recent conditions</p>
						</CardHeader>
						<CardContent>
							{insightLoading ? (
								<p className="text-sm text-muted-foreground">Generating insights…</p>
							) : insight ? (
								<>
									<p className="text-sm mb-4 whitespace-pre-line">{insight}</p>
									<div className="flex items-center gap-3">
										<button
											type="button"
											onClick={handleDownloadExcel}
											disabled={downloadLoading}
											className="inline-flex items-center rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
										>
											{downloadLoading ? "Preparing file…" : "Download Excel report"}
										</button>
										<p className="text-xs text-slate-400">Includes 1-day history and current insight</p>
									</div>
								</>
							) : insightError ? (
								<>
									<p className="text-sm text-red-500">{insightError}</p>
									<button
										type="button"
										onClick={handleDownloadExcel}
										disabled={downloadLoading}
										className="inline-flex items-center mt-3 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
									>
										{downloadLoading ? "Preparing file…" : "Download Excel report"}
									</button>
								</>
							) : (
								<>
									<p className="text-sm text-muted-foreground">No insight available yet.</p>
									<button
										type="button"
										onClick={handleDownloadExcel}
										disabled={downloadLoading}
										className="inline-flex items-center mt-3 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
									>
										{downloadLoading ? "Preparing file…" : "Download Excel report"}
									</button>
								</>
							)}
						</CardContent>
					</Card>
				</section>

				<FloodAlert
					waterLevel={typeof latestReading?.waterLevel === "number" ? latestReading.waterLevel : 0}
					timestamp={latestReading?.timestamp}
				/>

				<div className="grid grid-cols-1 gap-8 mb-12">
					<RainMeter rainfall={typeof latestReading?.rainfall === "number" ? latestReading.rainfall : 0} />
				</div>

				{typeof latestReading?.temperature === "number" && typeof latestReading?.humidity === "number" ? (
					<div className="mb-12 grid gap-4 md:grid-cols-2">
						{/* Temperature card - warm/red accent (inspired by water level styling) */}
						<Card className="bg-gradient-to-br from-red-700/6 to-red-500/4 rounded-2xl">
							<CardHeader>
								<CardTitle>Temperature Reading</CardTitle>
								<p className="text-sm text-muted-foreground">Current ambient temperature</p>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-300">Temperature</p>
										<p className="text-2xl font-semibold text-rose-400">
											{typeof latestReading?.temperature === "number" ? `${latestReading.temperature} °C` : "—"}
										</p>
									</div>
									<div className="text-sm text-slate-400">
										{new Date(latestReading?.timestamp ?? Date.now()).toLocaleTimeString()}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Humidity card - cool/teal accent (inspired by rainfall styling) */}
						<Card className="bg-gradient-to-br from-teal-700/6 to-emerald-500/4 rounded-2xl">
							<CardHeader>
								<CardTitle>Humidity Reading</CardTitle>
								<p className="text-sm text-muted-foreground">Relative humidity</p>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-300">Humidity</p>
										<p className="text-2xl font-semibold text-teal-300">
											{typeof latestReading?.humidity === "number" ? `${latestReading.humidity}%` : "—"}
										</p>
									</div>
									<div className="text-sm text-slate-400">
										{new Date(latestReading?.timestamp ?? Date.now()).toLocaleTimeString()}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				) : null}
			</main>

			<Footer />
		</div>
	);
};

export default Analytics;

