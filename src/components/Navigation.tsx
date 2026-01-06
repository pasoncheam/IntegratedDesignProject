import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import AuraByteLogo from "./AuraByteLogo.png";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // check if the link is active
  const isActive = (path: string) => location.pathname === path;

  // list of pages for the menu
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/analytics", label: "Flood Risk Prediction" },
    { path: "/gallery", label: "Waste Dectection" },
    { path: "/information", label: "Klang River" },
    { path: "/support", label: "Support" },
    { path: "/about", label: "About us" },
  ];

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={AuraByteLogo}
                alt="AURA Logo"
                className="w-full h-full object-contain"

                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center hidden">
                <span className="text-primary-foreground font-bold text-sm">AURA</span>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight">Project AURA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-6 py-2 rounded-full transition-all duration-200 font-medium",
                  isActive(link.path)
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          {/* menu for phone screens */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-6 py-3 rounded-full transition-all duration-200 font-medium text-center",
                      isActive(link.path)
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex justify-center mt-4">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
