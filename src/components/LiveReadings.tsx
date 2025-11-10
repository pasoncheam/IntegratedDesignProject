import { Card } from "@/components/ui/card";
import { useLiveReadings } from "@/hooks/useLiveReadings";

function formatTimestamp(ts?: number) {
	if (!ts && ts !== 0) return null;
	// Heuristic:
	// - If ts looks like epoch ms (>= 1e12), format date
	// - If ts looks like ESP millis() (< 1e12), show seconds since boot
	if (ts >= 1_000_000_000_000) {
		try {
			return new Date(ts).toLocaleString();
		} catch {
			return `${ts}`;
		}
	}
	const seconds = Math.round(ts / 1000);
	return `${seconds}s since device boot`;
}

const LiveReadings = () => {
	const { data, loading, error } = useLiveReadings();

	return (
		<Card className="p-6 mb-8">
			<h2 className="text-2xl font-bold mb-4">Live Readings</h2>
			{loading && <p className="text-muted-foreground">Connecting...</p>}
			{error && <p className="text-destructive">{error}</p>}
			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<div className="text-sm text-muted-foreground">Temperature</div>
						<div className="text-2xl font-semibold">{data?.temperature ?? "-"}°C</div>
					</div>
					<div>
						<div className="text-sm text-muted-foreground">Humidity</div>
						<div className="text-2xl font-semibold">{data?.humidity ?? "-"}%</div>
					</div>
					<div>
						<div className="text-sm text-muted-foreground">Timestamp</div>
						<div className="text-2xl font-semibold">
							{typeof data?.timestamp !== "undefined" ? formatTimestamp(data.timestamp) : "-"}
						</div>
						{typeof data?.timestamp !== "undefined" && (
							<div className="text-xs text-muted-foreground">raw: {data.timestamp}</div>
						)}
					</div>
				</div>
			)}
			{typeof data?.timestamp !== "undefined" && (
				<p className="text-xs text-muted-foreground mt-4">
					Last update: {formatTimestamp(data.timestamp)}
				</p>
			)}
		</Card>
	);
};

export default LiveReadings;


