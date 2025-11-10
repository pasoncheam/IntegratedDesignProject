import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloodAlert from "@/components/FloodAlert";
import RecentPhoto from "@/components/RecentPhoto";
import RainMeter from "@/components/RainMeter";
import LocationMap from "@/components/LocationMap";
import TempHumidity from "@/components/TempHumidity";
import { useLiveReadings } from "@/hooks/useLiveReadings";

const Analytics = () => {
  const { data } = useLiveReadings(); // expects rainfall, waterLevel, temperature, humidity, timestamp
	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />

			<main className="flex-1 container mx-auto px-4 py-8">
				<FloodAlert waterLevel={typeof data?.waterLevel === "number" ? data!.waterLevel : 0} timestamp={data?.timestamp} />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					<RecentPhoto />
					<RainMeter rainfall={typeof data?.rainfall === "number" ? data!.rainfall : 0} />
				</div>

        {typeof data?.temperature === "number" && typeof data?.humidity === "number" ? (
          <div className="mb-12">
            <TempHumidity temperature={data!.temperature} humidity={data!.humidity} timestamp={data?.timestamp} />
          </div>
        ) : null}

				<LocationMap />
			</main>

			<Footer />
		</div>
	);
};

export default Analytics;


