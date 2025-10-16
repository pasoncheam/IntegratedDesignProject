import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloodAlert from "@/components/FloodAlert";
import RecentPhoto from "@/components/RecentPhoto";
import RainMeter from "@/components/RainMeter";
import LocationMap from "@/components/LocationMap";

const Analytics = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />

			<main className="flex-1 container mx-auto px-4 py-8">
				<FloodAlert />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					<RecentPhoto />
					<RainMeter />
				</div>

				<LocationMap />
			</main>

			<Footer />
		</div>
	);
};

export default Analytics;


