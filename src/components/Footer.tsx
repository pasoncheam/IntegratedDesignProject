// footer at the bottom of the page
const Footer = () => {
  return (
    <footer className="bg-secondary mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div >
            <h3 className="font-bold mb-3 text-foreground text-xl">Related Links</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              {/*<a href="https://www.klangriverfestival.com/" className="block hover:text-primary transition-colors">
                <b>Klang River Festival</b>
              </a>*/}
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

          <div>
            <h3 className="font-bold mb-3 text-foreground text-xl">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/aurabyteucsi/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors"
              >
                {/* Instagram icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                <span>@aurabyteucsi</span>
              </a>

              <a
                href="https://www.tiktok.com/@aurabyte2025"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="TikTok"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors"
              >
                {/* TikTok icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M21 8.5c-2.7 0-5.1-1.9-5.6-4.5H13v12.1a4.1 4.1 0 1 1-3.4-4.1V9.3a7.1 7.1 0 1 0 6.9 7.3V8a8 8 0 0 0 4.5 1.5v-1z" />
                </svg>
                <span>@aurabyteucsi</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
