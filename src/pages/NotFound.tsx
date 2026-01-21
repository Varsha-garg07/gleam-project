import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="text-center animate-fade-up">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-xl">
          <Car className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="font-display text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! This route doesn't exist.
        </p>
        
        <Link to="/">
          <Button size="lg" className="btn-primary-gradient">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
