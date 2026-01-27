import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Car, Calendar, History, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { onAuthChange, logOut } from "@/lib/firebase/auth";
import NotificationCenter from "./NotificationCenter";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return () => unsub();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const studentLinks = [
    { href: "/book", label: "Book Ride", icon: Car },
    { href: "/myrides", label: "My Rides", icon: Calendar },
  ];

  const driverLinks = [
    { href: "/driver-dashboard", label: "Dashboard", icon: Car },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/driver/history", label: "History", icon: History },
  ];

  const adminLinks = [
    { href: "/admin/cars", label: "Manage Cars", icon: Settings },
  ];

  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === "driver") return driverLinks;
    if (user.role === "admin") return [...driverLinks, ...adminLinks];
    return studentLinks;
  };

  const navLinks = getNavLinks();

  // 🚫 PUBLIC NAVBAR (HOME / LOGIN / REGISTER)
  if (!user) {
    return (
      <header className="border-b bg-background">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">CampusRide</Link>
          <div className="flex gap-2">
            <Link to="/login-student"><Button variant="ghost">Login</Button></Link>
            <Link to="/register"><Button>Register</Button></Link>
          </div>
        </div>
      </header>
    );
  }

  // ✅ AUTH NAVBAR
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/book" className="font-bold text-xl">CampusRide</Link>

        <nav className="hidden md:flex gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  isActive(link.href)
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <NotificationCenter />
          <Button
            variant="outline"
            onClick={async () => {
              await logOut();
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
