import { Card } from "@/components/ui/card";

type TempHumidityProps = {
	temperature: number; // °C
	humidity: number; // %
	timestamp?: number;
};

function formatTimestamp(ts?: number) {
	if (typeof ts === "undefined") return "—";
	if (ts >= 1_000_000_000_000) return new Date(ts).toLocaleString();
	return `${Math.round(ts / 1000)}s since boot`;
}

const TempHumidity = ({ temperature, humidity, timestamp }: TempHumidityProps) => {
	return (
		<Card className="p-6 h-full">
			<h3 className="text-xl font-bold mb-4">Environment</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-data-bg rounded-lg p-6 text-center">
					<div className="text-sm text-muted-foreground mb-1">Temperature</div>
					<div className="text-4xl font-bold">
						{temperature}
						<span className="text-2xl ml-1">°C</span>
					</div>
				</div>
				<div className="bg-data-bg rounded-lg p-6 text-center">
					<div className="text-sm text-muted-foreground mb-1">Humidity</div>
					<div className="text-4xl font-bold">
						{humidity}
						<span className="text-2xl ml-1">%</span>
					</div>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-4">
				Last update: {formatTimestamp(timestamp)}
			</p>
		</Card>
	);
};

export default TempHumidity;


