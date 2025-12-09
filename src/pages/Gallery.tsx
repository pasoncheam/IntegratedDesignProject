import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import photosData from "../../public/detected_waste_photos/photos.json";

interface Photo {
  id: string;
  url: string;
  date: string;
  time: string;
  original_name: string;
}

const Gallery = () => {
  const [photos] = useState<Photo[]>(photosData as Photo[]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Detected Waste Gallery</h1>

        {photos.length === 0 ? (
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
