import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import QRCode from "./pasonQRCode.jpg";

// support page for donations
const Support = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />
			<main className="flex-1 bg-background">
				<section className="container mx-auto px-4 py-12">
					<div className="text-center max-w-2xl mx-auto">
						<div className="inline-flex h-10 w-10 items-center justify-center rounded-full border mb-3" aria-hidden>
							<span className="text-xl">❤</span>
						</div>
						<h1 className="text-4xl font-extrabold tracking-tight mb-2">Support Project AURA</h1>
						<p className="text-muted-foreground mb-10">
							Your support helps us towards the successful execution of our project.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
						{/* Local Support */}
						<div className="rounded-2xl border bg-card text-card-foreground p-6 shadow-sm">
							<div className="text-center">
								<div className="inline-flex h-8 w-8 items-center justify-center rounded-full border mb-3" aria-hidden>
									<span className="text-sm">QR</span>
								</div>
								<h2 className="text-lg font-bold">Local Support (Malaysia)</h2>
								<p className="text-xs text-muted-foreground">Scan the QR code to donate directly</p>
							</div>
							<div className="mt-6 rounded-xl border bg-muted/30 p-6">
								<div className="mx-auto max-w-xs">
									<div className="rounded-xl border bg-background p-4">
										{/* Replace with your QR image */}
										<img src={QRCode} alt="QR code" className="w-full h-auto object-contain" />
									</div>
								</div>
							</div>
							<p className="text-[11px] text-muted-foreground text-center mt-4">
								Use Touch N GO for support
							</p>
						</div>

						{/* International Support */}
						<div className="rounded-2xl border bg-card text-card-foreground p-6 shadow-sm">
							<div className="text-center">
								<div className="inline-flex h-8 w-8 items-center justify-center rounded-full border mb-3" aria-hidden>
									<span className="text-sm">☕</span>
								</div>
								<h2 className="text-lg font-bold">International Support</h2>
								<p className="text-xs text-muted-foreground">Support our project from anywhere in the world</p>
							</div>
							<div className="mt-6 rounded-xl border bg-muted/30 p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
								<div className="text-5xl mb-4" aria-hidden>☕</div>
								<p className="text-sm text-muted-foreground mb-4">Buy us a coffee and support our work</p>
								<a href="https://buymeacoffee.com/pasoncheam" target="_blank" rel="noreferrer noopener">
									<Button className="px-6">Buy us a Coffee</Button>
								</a>
							</div>
							<p className="text-[11px] text-muted-foreground text-center mt-4">Secure payment via Buy Me a Coffee</p>
						</div>
					</div>

					<div className="max-w-3xl mx-auto mt-10">
						<div className="rounded-xl border bg-card text-card-foreground p-4 text-center text-sm text-muted-foreground">
							Every contribution, no matter the size, means the world to us.
							<div className="mt-1 text-foreground">Thank you for your support! ❤</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default Support;


