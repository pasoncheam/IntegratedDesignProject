import { useState } from "react";
import { X } from "lucide-react";
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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

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
