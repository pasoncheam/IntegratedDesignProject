import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KlangRiverFestival from "./klangRiverFestivalLogo.png";
import TeamPhoto from "./TeamPhoto.jpg";
import ProfessorChong from "./ProfessorChong.jpeg";
import Pason from "./PasonPhoto.jpg";
import ShangPing from "./ShangPingPhoto.jpg";
import Stewart from "./StewartPhoto.jpg";
import WJ from "./WJPhoto.jpg";

// page to show our team members
const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">Klang River Festival Organization</h1>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-muted rounded-lg flex items-center justify-center overflow-hidden mb-6">
              <img 
                src={KlangRiverFestival}
                alt="Klang River Festival Organization"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          
          <div className="bg-data-bg rounded-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">About the Organization</h2>
            <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              The Klang River Festival Organization is dedicated to promoting environmental awareness 
              and sustainable practices along the Klang River. Through community engagement, educational 
              programs, and innovative monitoring solutions, we work to protect and preserve this vital 
              waterway for future generations. Our annual festival brings together thousands of participants 
              to celebrate the river's importance to our region.
            </p>
          </div>
        </section> */}

        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">UCSI IDP TEAM AURA</h2>

          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center overflow-hidden mb-6">
              <img
                src={TeamPhoto}
                alt="UCSI IDP Team AURA"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-data-bg rounded-lg p-8 max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold mb-4 text-center">Our Team</h3>
            <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              Greetings fellow audience! We are AuraByte, a team of 4 computer engineering students from UCSI University.
              The Autonomous Urban River Analyzer (AURA) prototype, is our project for our <i>Integrated Design Project (BER4023)</i> course.<br></br> <br></br>
              We developed this website as a platform to view data collected by our prototype in order to perform flood risk analysis for flood alert,
              and waste detection for monitoring the urban river condition, which in this case is the Klang River.<br></br> <br></br>
              Other than river monitoring, the website also serves to boost community engagement by increase the awareness of the public on urban river
              conditions. Showcasing the prototype also allows to inspire aspiring engineers in the community. We hope you enjoyed our work!
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Team Members</h3>

            {/* Supervisor */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-center text-muted-foreground">Supervisor</h4>
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 bg-muted rounded-full overflow-hidden mb-4 mx-auto border-4 border-primary">
                    <img
                      src={ProfessorChong}
                      alt="Supervisor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-bold text-lg">Assistant Professor Ir Ts Dr Chong Kim Soon</h5>
                  <p className="text-sm text-muted-foreground">Project Supervisor</p>
                </div>
              </div>
            </div>

            {/* Student Members */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-center text-muted-foreground">Students</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full overflow-hidden mb-3 mx-auto border-2 border-accent">
                    <img
                      src={Pason}
                      alt="Student 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-semibold">Pason Cheam Tung Huay</h5>
                  <h5 className="font-semibold">1002163305</h5>
                  <p className="text-xs text-muted-foreground"><b>Project Engineer (Group Leader)</b></p>
                </div>

                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full overflow-hidden mb-3 mx-auto border-2 border-accent">
                    <img
                      src={ShangPing}
                      alt="Student 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-semibold">Ng Shang Ping</h5>
                  <h5 className="font-semibold">1002267730</h5>
                  <p className="text-xs text-muted-foreground"><b>Sales Engineer</b></p>
                </div>

                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full overflow-hidden mb-3 mx-auto border-2 border-accent">
                    <img
                      src={Stewart}
                      alt="Student 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-semibold">Tan Kai Xi</h5>
                  <h5 className="font-semibold">1002162289</h5>
                  <p className="text-xs text-muted-foreground"><b>Hardware Engineer</b></p>
                </div>

                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full overflow-hidden mb-3 mx-auto border-2 border-accent">
                    <img
                      src={WJ}
                      alt="Student 4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-semibold">Tee Wei Jian</h5>
                  <h5 className="font-semibold">1002163325</h5>
                  <p className="text-xs text-muted-foreground"><b>Software Engineer</b></p>
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

export default About;
