import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

interface Photo {
  id: string;
  url: string;
  date: string;
  time: string;
  original_name: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/Detected%20waste%20photo/photos.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch photos");
        }
        return res.json();
      })
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading photos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Detected Waste Gallery</h1>

        {loading ? (
          <div className="text-center py-10">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No detected waste photos available yet.
            <br />
            Photos will appear here once the detection system runs.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden group">
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
