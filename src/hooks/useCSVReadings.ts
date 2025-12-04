import { useState, useEffect } from 'react';

export type SensorReading = {
    timestamp: number;
    waterLevel: number;
    rainfall: number;
    humidity: number;
    temperature: number;
    id: string;
};

export const useCSVReadings = () => {
    const [data, setData] = useState<SensorReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCSV = async () => {
            try {
                // Use Vite's BASE_URL to handle deployment subpaths correctly
                const baseUrl = import.meta.env.BASE_URL;
                // Remove trailing slash from baseUrl if present to avoid double slashes
                const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                const response = await fetch(`${cleanBaseUrl}/sensor_data.csv`);
                if (!response.ok) {
                    if (response.status === 404) {
                        // File might not exist yet if the action hasn't run
                        setData([]);
                        setLoading(false);
                        return;
                    }
                    throw new Error('Failed to fetch CSV data');
                }

                const text = await response.text();
                const lines = text.trim().split('\n');

                if (lines.length < 2) {
                    setData([]);
                    setLoading(false);
                    return;
                }

                const headers = lines[0].split(',');
                const readings: SensorReading[] = [];

                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',');
                    if (values.length !== headers.length) continue;

                    const reading: any = {};
                    // Map CSV columns to object properties
                    // CSV columns: humidity,rainfall,temperature,waterLevel,timestamp
                    // Note: The order depends on how pandas writes it. 
                    // store_sensor_data.py writes: humidity, rainfall, temperature, waterLevel, timestamp

                    // To be safe, let's map by index based on header name
                    headers.forEach((header, index) => {
                        const value = values[index];
                        if (header === 'timestamp') {
                            // Parse timestamp string "YYYY-MM-DD HH:MM:SS" to epoch
                            reading.timestamp = new Date(value).getTime();
                        } else {
                            reading[header] = parseFloat(value);
                        }
                    });

                    reading.id = `csv-${reading.timestamp}`;
                    readings.push(reading as SensorReading);
                }

                setData(readings);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching CSV readings:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchCSV();

        // Refresh every minute to pick up new data from the CSV (if the app is open)
        const interval = setInterval(fetchCSV, 60000);
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
};
