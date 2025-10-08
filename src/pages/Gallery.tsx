import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Gallery = () => {
  // Mock gallery data
  const photos = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    time: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleTimeString(),
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Gallery</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group">
              <div className="bg-muted aspect-[4/3] flex items-center justify-center overflow-hidden">
                <img 
                  src={`/api/placeholder/600/450?text=Photo ${photo.id}`}
                  alt={`Gallery photo ${photo.id}`}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
