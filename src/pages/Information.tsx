import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KlangRiver from "./KlangRiverPhoto.png";
import revivedRiver from "./NewwKlangRiverPicSketch.jpg";
import TheSDGs from "./TheSDGs.png";

// info page about the klang river project
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
                The Klang River (Sungai Klang) is a 120-kilometre river flowing through Selangor and Kuala Lumpur, Malaysia, before
                emptying into the Straits of Malacca near Port Klang. It holds historical importance as Kuala Lumpur was founded at
                the confluence of the Klang and Gombak rivers. Over the years, the river became polluted due to rapid urbanization
                and industrial waste. However, efforts such as the River of Life (ROL) project have been introduced to clean, restore,
                and beautify the river, turning parts of it especially near Masjid Jamek into attractive urban and tourism areas.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border bg-muted transform rotate-1">
              <div className="aspect-[2/1] w-full">
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
              <div className="aspect-[2/1] w-full">
                <img
                  src={revivedRiver}
                  alt="Historic Klang River"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  Source:{" "}
                  <a
                    href="https://cilisos.my/for-7-years-the-govt-tried-turning-klang-river-into-a-tourist-spot-how-much-did-they-spend/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-primary hover:underline"
                  >
                    CiliSos
                  </a>
                </p>
              </div>
            </div>
            <div className="rounded-2xl border bg-card text-card-foreground p-8 shadow-xl transform rotate-1">
              <div className="flex items-start gap-3 mb-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border" aria-hidden>
                  {/* icon placeholder */}
                </span>
                <h2 className="text-2xl font-bold">Reviving the Klang River</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                As the Klang River became a much of concern to the town in Kuala Lumpur, many initiatives have been made
                to reduce the pollution of the Klang River. These initiatives include SMART Tunnel Launch, River of Life
                Megaproject, River Three CPR Programme, and the most recent initiative of Ocean Cleanup Expansion and
                Coca-Cola Partnership in opening waste sorting facilities on Malaysia’s Klang River (Yahoo News, 2025).
                These initiatives not only help reduce the pollution, but it inspire other companies, NGOs, and volunteers
                to get involved in cleaning the Klang River.
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
