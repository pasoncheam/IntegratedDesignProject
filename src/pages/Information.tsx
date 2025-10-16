import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KlangRiver from "./KlangRiverPhoto.png";
import TheSDGs from "./TheSDGs.png";

const Information = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* About & History styled like alternating feature cards */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8">The Klang River</h1>

          {/* Row 1: Text card left, image card right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-10">
            <div className="rounded-2xl border bg-card text-card-foreground p-8 shadow-xl transform -rotate-1">
              <div className="flex items-start gap-3 mb-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border" aria-hidden>
                  {/* icon placeholder */}
                </span>
                <h2 className="text-2xl font-bold">About the River</h2>
              </div>
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
            <div className="rounded-2xl overflow-hidden shadow-xl border bg-muted transform rotate-1">
              <div className="aspect-[4/3] w-full">
                <img
                  src={KlangRiver}
                  alt="Klang River"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Image card left, text card right (History) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="rounded-2xl overflow-hidden shadow-xl border bg-muted transform -rotate-1">
              <div className="aspect-[4/3] w-full">
                <img
                  src={KlangRiver}
                  alt="Historic Klang River"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="rounded-2xl border bg-card text-card-foreground p-8 shadow-xl transform rotate-1">
              <div className="flex items-start gap-3 mb-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border" aria-hidden>
                  {/* icon placeholder */}
                </span>
                <h2 className="text-2xl font-bold">History of the Klang River</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The Klang River has shaped the growth of the Klang Valley for centuries, serving as a key
                transportation and trade route that connected communities along its banks. Urbanization and
                industrial activity increased through the 20th century, bringing challenges such as flooding
                and pollution.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Recent decades have seen revitalization efforts focused on flood mitigation, water quality
                improvement, and habitat restoration. Today, real-time monitoring and community engagement
                help safeguard the river while enabling sustainable development.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8">Sustainable Development Goals (SDGs)</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
            <img 
                src={TheSDGs}
                alt="The SDGs"
                className="w-full h-full object-contain"
              />
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
