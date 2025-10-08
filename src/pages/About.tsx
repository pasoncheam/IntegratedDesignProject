import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">Klang River Festival Organization</h1>
          
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center overflow-hidden mb-6">
              <img 
                src="/api/placeholder/900/500?text=Klang River Festival"
                alt="Klang River Festival Organization"
                className="w-full h-full object-cover"
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
        </section>
        
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">UCSI IDP TEAM AURA</h2>
          
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center overflow-hidden mb-6">
              <img 
                src="/api/placeholder/900/500?text=UCSI IDP Team"
                alt="UCSI IDP Team AURA"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="bg-data-bg rounded-lg p-8 max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold mb-4 text-center">Our Team</h3>
            <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              AURA (Automated Urban River Analytics) is an innovative project developed by the 
              Interdisciplinary Project (IDP) team at UCSI University. Our multidisciplinary team 
              combines expertise in engineering, environmental science, and data analytics to create 
              cutting-edge monitoring solutions. We are passionate about using technology to address 
              environmental challenges and provide valuable insights for researchers, policymakers, 
              and the community.
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
                      src="/api/placeholder/200/200?text=Supervisor"
                      alt="Supervisor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-bold text-lg">Dr. Supervisor Name</h5>
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
                      src="/api/placeholder/200/200?text=Student 1"
                      alt="Student 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-semibold">Student Name 1</h5>
                  <p className="text-xs text-muted-foreground">Team Member</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full overflow-hidden mb-3 mx-auto border-2 border-accent">
                    <img 
                      src="/api/placeholder/200/200?text=Student 2"
                      alt="Student 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-semibold">Student Name 2</h5>
                  <p className="text-xs text-muted-foreground">Team Member</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full overflow-hidden mb-3 mx-auto border-2 border-accent">
                    <img 
                      src="/api/placeholder/200/200?text=Student 3"
                      alt="Student 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-semibold">Student Name 3</h5>
                  <p className="text-xs text-muted-foreground">Team Member</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full overflow-hidden mb-3 mx-auto border-2 border-accent">
                    <img 
                      src="/api/placeholder/200/200?text=Student 4"
                      alt="Student 4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-semibold">Student Name 4</h5>
                  <p className="text-xs text-muted-foreground">Team Member</p>
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
