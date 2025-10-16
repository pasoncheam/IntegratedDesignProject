import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import homeBackgroundImage from "./homeBackgroundImage.png";

const Home = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />

			<main className="flex-1">
				<section className="relative border-b border-border bg-background overflow-hidden">
					{/* Background image area */}
					<div className="absolute inset-0 bg-black/50">
						<img
							src={ homeBackgroundImage }
							alt="rubbish placeholder"
							className="h-full w-full object-cover"
						/>
						<div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
					</div>

					<div className="container mx-auto px-4 py-16 text-center">
						<div className="inline-block mx-auto rounded-xl bg-background/70 dark:bg-background/60 backdrop-blur-sm px-6 py-6 shadow-lg">
							<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
								Project AURA
							</h1>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								Automated Urban River Analytics for Klang River: real-time monitoring, insights,
								and community awareness to help keep our river safe.
							</p>
						</div>
						<div className="flex items-center justify-center gap-3 mt-6">
							<Link to="/analytics">
								<Button size="lg" className="px-8">View Analytics</Button>
							</Link>
							<Link to="/information">
								<Button size="lg" variant="outline" className="px-8">Learn About Klang River</Button>
							</Link>
						</div>
					</div>
				</section>

				<section>
					<div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
						<div className="p-6 rounded-lg border bg-card text-card-foreground">
							<h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
							<p className="text-muted-foreground">
								Get up-to-date flood and rainfall alerts powered by our monitoring network.
							</p>
						</div>
						<div className="p-6 rounded-lg border bg-card text-card-foreground">
							<h3 className="text-xl font-semibold mb-2">Live Dashboards</h3>
							<p className="text-muted-foreground">
								Explore visual analytics on rainfall intensity, water levels, and local conditions.
							</p>
						</div>
						<div className="p-6 rounded-lg border bg-card text-card-foreground">
							<h3 className="text-xl font-semibold mb-2">Community Impact</h3>
							<p className="text-muted-foreground">
								Learn how data supports safety, planning, and sustainability for Klang River.
							</p>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default Home;
