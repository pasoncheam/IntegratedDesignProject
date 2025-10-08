const Footer = () => {
  return (
    <footer className="bg-secondary mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div >
            <h3 className="font-bold mb-3 text-foreground text-xl">Related Links</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <a href="https://www.klangriverfestival.com/" className="block hover:text-primary transition-colors">
                <b>Klang River Festival</b>
              </a>
              <a href="https://ucsi.edu.my" className="block hover:text-primary transition-colors">
                <b>UCSI University</b>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-foreground text-xl">Contacts</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><b>Supervisor email:</b> ChongKS@ucsiuniversity.edu.my</p>
              <p><b>Group leader email:</b> pasoncheam@yahoo.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
