import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Information = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8">Klang River</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
              <img 
                src="/api/placeholder/800/600?text=Klang River"
                alt="Klang River"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-data-bg rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">About the River</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Klang River is a vital waterway that flows through the heart of Malaysia's capital city. 
                Our monitoring system helps track water levels and environmental conditions to protect 
                communities and provide valuable data for researchers. The river plays a crucial role in 
                the region's ecosystem and flood management systems.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Real-time monitoring helps authorities respond quickly to changing conditions and enables 
                better urban planning and environmental protection measures.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8">SDG</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🌍</div>
                <p className="text-xl font-bold">Sustainable Development Goals</p>
              </div>
            </div>
            
            <div className="bg-data-bg rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Our Contribution</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">SDG 6: Clean Water and Sanitation</h4>
                  <p>Monitoring water quality and availability to ensure sustainable management of water resources.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">SDG 11: Sustainable Cities and Communities</h4>
                  <p>Providing data for urban planning and disaster risk reduction to make cities more resilient.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">SDG 13: Climate Action</h4>
                  <p>Contributing to climate monitoring and adaptation strategies through environmental data collection.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Information;
