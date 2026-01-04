import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import homeBackgroundImage from "./homeBackgroundImage.png";
import { Check } from "lucide-react";
import conceptualImage from "./conceptualImage.png";
import EnquireNow from "@/components/EnquireNow";
import LocationMap from "@/components/LocationMap";

const Home = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />

			<main className="flex-1">
				<section className="relative border-b border-border bg-background overflow-hidden">
					{/* Background image area */}
					<div className="absolute inset-0 bg-black/50">
						<img
							src={homeBackgroundImage}
							alt="rubbish placeholder"
							className="h-full w-full object-cover"
						/>
						<div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
					</div>

					<div className="container mx-auto px-4 py-16 text-center">
						<div className="inline-block mx-auto rounded-xl bg-background/70 dark:bg-background/60 backdrop-blur-sm px-6 py-6 shadow-lg">
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								Welcome to
							</p>
							<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
								Project AURA
							</h1>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								AURA (Autonomous Urban River Analyzer): AI-Integrated Urban River Analyzer for Real-Time Environmental Sensing and Beautification
							</p>
						</div>

					</div>
				</section>

				<section className="border-t border-border">
					<div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
						<div className="overflow-hidden">
							<AspectRatio ratio={3 / 3}>
								<img src={conceptualImage} alt="AURA prototype" className="h-full w-full object-contain" />
							</AspectRatio>

						</div>

						<div>
							<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Autonomous Urban River Analyzer (AURA)</h2>
							<p className="text-muted-foreground leading-relaxed mb-6">
								The <b>AURA</b> prototype aims to provides real-time monitoring of the river environemntalcondition,
								increase public engagement and awarenes on urban rivers in a sustainable, scalable approach. <br></br><br></br>
								Furthermore, the AURA prototype's purpose is to align with Klang River Festival (KRF) objectives by
								raising awareness about the importance of the river while offering engineering solutions to the community. <br></br><br></br>
								The prototype is solar-powered with a set of useful features. Those features include detecting and capturing
								floating trash with a camera, measuring the water level of the river for flood monitoring, issuing flood alerts
								for early evacuation, and monitoring water quality. The prototype is set up beside the river under the sun in an
								open space to perform accurate measurements; with the prototype under the sun, it can acquire solar energy from the
								solar panel.
							</p>
							<h3 className="text-xl font-semibold mb-3">Key Features</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mb-8">
								<div className="space-y-3">
									<div className="flex items-start gap-2"><Check className="h-5 w-5 mt-0.5" /><span>Real-time river monitoring</span></div>
									<div className="flex items-start gap-2"><Check className="h-5 w-5 mt-0.5" /><span>Predict potential flood occurrence</span></div>
								</div>
								<div className="space-y-3">
									<div className="flex items-start gap-2"><Check className="h-5 w-5 mt-0.5" /><span>Public dashboard for community engagement</span></div>
									<div className="flex items-start gap-2"><Check className="h-5 w-5 mt-0.5" /><span>Use of renewable energy (Solar)</span></div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Link to="/support"><Button className="px-6">Support our project</Button></Link>
								<div className="[&>button]:bg-red-600 [&>button]:hover:bg-red-700 [&>button]:text-white">
									<EnquireNow defaultProduct="AURA Prototype" />
								</div>
							</div>

						</div>
					</div>
				</section>

				<section>
					<div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
						<div className="p-6 rounded-lg border bg-card text-card-foreground">
							<h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
							<p className="text-muted-foreground">
								Get up-to-date flood alerts and waste condition powered by our monitoring network.
							</p>
						</div>
						<div className="p-6 rounded-lg border bg-card text-card-foreground">
							<h3 className="text-xl font-semibold mb-2">Live Dashboards</h3>
							<p className="text-muted-foreground">
								Explore visual analytics on rainfall intensity, water levels, and river conditions.
							</p>
						</div>
						<div className="p-6 rounded-lg border bg-card text-card-foreground">
							<h3 className="text-xl font-semibold mb-2">Community Impact</h3>
							<p className="text-muted-foreground">
								Learn how data supports safety, planning, and sustainability for urban rivers.
							</p>
						</div>
					</div>
				</section>

				<section className="border-t border-border">
					<div className="container mx-auto px-4 py-12">
						<h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">Introductory Video</h2>
						<p className="text-muted-foreground text-center max-w-2xl mx-auto mb-6">
							A quick introduction to Project AURA.
						</p>
						<div className="max-w-4xl mx-auto">
							<AspectRatio ratio={16 / 9}>
								<iframe
									src="https://www.youtube.com/embed/bKPGFJ3YbDc"
									title="Project AURA Intro Video"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="w-full h-full rounded-lg border"
								></iframe>
							</AspectRatio>
							{/*<p className="text-xs text-muted-foreground mt-2 text-center">
								Replace <code>/intro.mp4</code> with your actual video file or hosting URL.
							</p>*/}
						</div>
					</div>

				</section>

				<LocationMap />

			</main>

			<Footer />
		</div>
	);
};

export default Home;
