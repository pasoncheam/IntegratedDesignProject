const Footer = () => {
  return (
    <footer className="bg-secondary mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-3 text-foreground">About Aura</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <a href="https://klangriverfestival.org" className="block hover:text-primary transition-colors">
                Klang River Festival
              </a>
              <a href="https://ucsi.edu.my" className="block hover:text-primary transition-colors">
                UCSI University
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-foreground">Contact us</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>(NGO phone number)</p>
              <p>(NGO Email)</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
