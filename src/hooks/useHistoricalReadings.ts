import { useEffect, useMemo, useState } from "react";
import { getFirebaseDatabase } from "@/lib/firebase";
import { onValue, query, ref, limitToLast, orderByChild } from "firebase/database";
import type { LiveReadings } from "./useLiveReadings";

export type HistoricalReading = LiveReadings & {
	id: string;
	timestamp: number;
};

export function useHistoricalReadings(
	path: string = "sensors/history",
	limit: number = 48,
) {
	const [data, setData] = useState<HistoricalReading[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			const db = getFirebaseDatabase();
			const historyRef = ref(db, path);
			const limitedQuery = query(historyRef, orderByChild("timestamp"), limitToLast(limit));

			const unsubscribe = onValue(
				limitedQuery,
				(snapshot) => {
					const value = snapshot.val() as Record<string, LiveReadings> | null;
					if (!value) {
						setData([]);
						setLoading(false);
						return;
					}

					const parsed = Object.entries(value)
						.map(([id, reading]) => ({
							id,
							timestamp: typeof reading.timestamp === "number" ? reading.timestamp : Date.now(),
							...reading,
						}))
						.sort((a, b) => a.timestamp - b.timestamp);

					setData(parsed);
					setLoading(false);
				},
				(err) => {
					setError(err.message ?? "Failed to load historical data");
					setLoading(false);
				},
			);

			return () => unsubscribe();
		} catch (err) {
			setError("Failed to subscribe to historical data");
			setLoading(false);
		}
	}, [path, limit]);

	return useMemo(
		() => ({
			data,
			loading,
			error,
		}),
		[data, loading, error],
	);
}


