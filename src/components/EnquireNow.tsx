import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type EnquireNowProps = {
	defaultProduct?: string;
	triggerClassName?: string;
};

// CUSTOMIZE THIS VALUE AFTER SETTING UP GOOGLE APPS SCRIPT:
// Replace with your Google Apps Script Web App URL (get this from the setup guide)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzKy50RixlioNvBAQ0mwg2Ld-6DULbI6ocLXofVEI99Er246pTkFNY_69kQPvGfafWW/exec"; // e.g., "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"

const EnquireNow = ({ defaultProduct = "AURA Prototype", triggerClassName }: EnquireNowProps) => {
	const [open, setOpen] = useState(false);
	const [fullName, setFullName] = useState("");
	const [company, setCompany] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [product, setProduct] = useState(defaultProduct);
	const [message, setMessage] = useState("");
	const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const validate = () => {
		const newErrors: { fullName?: string; email?: string } = {};
		if (!fullName.trim()) newErrors.fullName = "Full name is required";
		if (!email.trim()) newErrors.email = "Email is required";
		else {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;
		
		// Check if Google Script URL is configured
		if (GOOGLE_SCRIPT_URL === "https://script.google.com/macros/s/AKfycbzKy50RixlioNvBAQ0mwg2Ld-6DULbI6ocLXofVEI99Er246pTkFNY_69kQPvGfafWW/exec") {
			toast({
				title: "Configuration Error",
				description: "Google Sheets integration is not configured. Please set up your Google Apps Script URL in the EnquireNow component.",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Prepare data to send to Google Sheets
			const formData = {
				fullName: fullName,
				email: email,
				company: company || "",
				phone: phone || "",
				product: product,
				message: message || "",
				timestamp: new Date().toISOString(),
			};

			// Send data to Google Sheets via Google Apps Script
			const response = await fetch(GOOGLE_SCRIPT_URL, {
				method: "POST",
				mode: "no-cors", // Required for Google Apps Script
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			// Note: With no-cors mode, we can't read the response, so we assume success
			// The Google Apps Script will handle the data insertion

			toast({
				title: "Enquiry Submitted!",
				description: "Thank you for your enquiry. Your information has been recorded.",
			});

			// Close modal and reset form
			setOpen(false);
			resetForm();
		} catch (error) {
			console.error("Google Sheets error:", error);
			toast({
				title: "Error",
				description: "Failed to submit enquiry. Please try again later or contact us directly.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFullName("");
		setCompany("");
		setEmail("");
		setPhone("");
		setProduct(defaultProduct);
		setMessage("");
		setErrors({});
	};

	return (
		<Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
			<DialogTrigger asChild>
				<Button className={triggerClassName}>Enquire Now</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Enquire Now</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<label htmlFor="fullName" className="text-sm font-medium">Full Name *</label>
						<Input 
							id="fullName" 
							value={fullName} 
							onChange={(e) => setFullName(e.target.value)} 
							placeholder="Enter your full name" 
						/>
						{errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
					</div>
					<div className="grid gap-2">
						<label htmlFor="company" className="text-sm font-medium">Company / Organization</label>
						<Input 
							id="company" 
							value={company} 
							onChange={(e) => setCompany(e.target.value)} 
							placeholder="Optional" 
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="email" className="text-sm font-medium">Email *</label>
						<Input 
							id="email" 
							type="email" 
							value={email} 
							onChange={(e) => setEmail(e.target.value)} 
							placeholder="name@example.com" 
						/>
						{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
					</div>
					<div className="grid gap-2">
						<label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
						<Input 
							id="phone" 
							value={phone} 
							onChange={(e) => setPhone(e.target.value)} 
							placeholder="Optional" 
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="product" className="text-sm font-medium">Product of Interest</label>
						<Input 
							id="product" 
							value={product} 
							onChange={(e) => setProduct(e.target.value)} 
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="message" className="text-sm font-medium">Message</label>
						<Textarea 
							id="message" 
							rows={5} 
							value={message} 
							onChange={(e) => setMessage(e.target.value)} 
							placeholder="Tell us more about your needs" 
						/>
					</div>
				</div>
				<div className="flex items-center justify-end gap-2 pt-2">
					<Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? "Sending..." : "Send Enquiry"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EnquireNow;

