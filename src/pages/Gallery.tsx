import { useState, useMemo } from "react";
import { X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import photosData from "../../public/detected_waste_photos/photos.json";
import historyData from "../../public/detected_waste_photos/waste_history.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Photo {
  id: string;
  url: string;
  date: string;
  time: string;
  original_name: string;
}

const Gallery = () => {
  const [photos] = useState<Photo[]>(photosData as Photo[]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // calculate how much trash we found
  const stats = useMemo(() => {
    // 1. Daily Counts
    const dailyMap = new Map<string, number>();
    (historyData as Photo[]).forEach((photo) => {
      const current = dailyMap.get(photo.date) || 0;
      dailyMap.set(photo.date, current + 1);
    });

    // Sort by date
    const dailyData = Array.from(dailyMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 2. Hourly Counts - see when trash comes heavily
    const hourlyMap = new Map<number, number>();
    // Initialize all 24 hours to 0 for a complete chart
    for (let i = 0; i < 24; i++) hourlyMap.set(i, 0);

    (historyData as Photo[]).forEach((photo) => {
      // time format: "HH:MM:SS"
      const hour = parseInt(photo.time.split(":")[0], 10);
      if (!isNaN(hour)) {
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      }
    });

    const hourlyData = Array.from(hourlyMap.entries())
      .map(([hour, count]) => ({
        hourLabel: new Date(0, 0, 0, hour).toLocaleTimeString([], {
          hour: "numeric",
          hour12: true,
        }),
        hourIndex: hour,
        count,
      }))
      .sort((a, b) => a.hourIndex - b.hourIndex);

    return { dailyData, hourlyData };
  }, [photos]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Detected Waste Gallery</h1>

        {/* --- Waste Trends Charts --- */}
        {photos.length > 0 && (
          <section className="mb-12 grid gap-8 md:grid-cols-2">
            {/* Daily Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Detections</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      label={{ value: "Waste detected", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "var(--muted-foreground)" } }}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--muted)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Waste Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hourly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="hourLabel"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      interval={3} // Show every 3rd label to avoid crowding
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      label={{ value: "Waste detected", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "var(--muted-foreground)" } }}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--muted)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Waste Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        )}

        {photos.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No detected waste photos available yet.
            <br />
            Photos will appear here once the detection system runs.
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Detected Waste</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <Card
                  key={photo.id}
                  className="overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="bg-muted aspect-[4/3] flex items-center justify-center overflow-hidden">
                    <img
                      src={photo.url}
                      alt={`Detected waste ${photo.date} ${photo.time}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="font-semibold">
                      <span className="text-muted-foreground">Date: </span>
                      {photo.date}
                    </p>
                    <p className="font-semibold">
                      <span className="text-muted-foreground">Time: </span>
                      {photo.time}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close full view"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={`Detected waste from ${selectedPhoto.date}`}
              className="object-contain max-h-[85vh] w-auto rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-white/90 text-center bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
              <p className="font-medium">
                {selectedPhoto.date} • {selectedPhoto.time}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
