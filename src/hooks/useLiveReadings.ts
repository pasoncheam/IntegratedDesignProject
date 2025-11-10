import { useEffect, useState } from "react";
import { getFirebaseDatabase } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";

export type LiveReadings = {
	temperature?: number; // degrees Celsius
	humidity?: number;    // percent
	timestamp?: number;   // ESP millis() or epoch ms
};

export function useLiveReadings(path: string = "sensors/latest") {
	const [data, setData] = useState<LiveReadings | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			const db = getFirebaseDatabase();
			const r = ref(db, path);
			const unsub = onValue(r, (snap) => {
				setData((snap.val() as LiveReadings) ?? null);
				setLoading(false);
			});
			return () => unsub();
		} catch (e) {
			setError("Failed to subscribe to live data");
			setLoading(false);
		}
	}, [path]);

	return { data, loading, error };
}


