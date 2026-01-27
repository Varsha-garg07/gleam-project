import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Calendar, MapPin, Users, ArrowRight, Zap, Clock, Shield, Building, BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import campusMainGate from "@/assets/campus-main-gate.jpg";
import campusAdminBlock from "@/assets/campus-admin-block.jpg";
import campusHostel from "@/assets/campus-hostel.jpg";
import campusLibrary from "@/assets/campus-library.jpg";

const HomePage = () => {
  const [showStudentMenu, setShowStudentMenu] = useState(false);
  const [showDriverMenu, setShowDriverMenu] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Schedule Ahead",
      description: "Book rides in advance and never miss your class or appointment.",
    },
    {
      icon: Users,
      title: "Smart Pooling",
      description: "Share rides with fellow students going the same way. Save time and resources.",
    },
    {
      icon: MapPin,
      title: "Campus Coverage",
      description: "All major campus locations covered - hostels, canteens, academic blocks.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Track your ride status and get notifications when your car arrives.",
    },
  ];

  const stats = [
    { value: "500+", label: "Daily Rides" },
    { value: "15+", label: "Campus Locations" },
    { value: "98%", label: "On-time Rate" },
    { value: "4.9", label: "User Rating" },
  ];

  return (
    <div className="page-container overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={campusMainGate}
            alt="NIT Jalandhar Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        </div>

        <div className="relative z-10 content-container w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Campus Transit Made Simple
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-foreground">Stop Waiting.</span>
                <br />
                <span className="text-gradient">Start Going.</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Your smart campus transit solution. Book rides, share pools, and get around campus effortlessly.
              </p>

              {/* Role Selection */}
              <div className="mb-8">
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  Select your role to get started
                </p>
                <div className="flex flex-wrap gap-4">
                  {/* Student Dropdown */}
                  <div className="relative">
                    <Button
                      size="lg"
                      className="btn-primary-gradient text-base px-8 py-6"
                      onClick={() => {
                        setShowStudentMenu(!showStudentMenu);
                        setShowDriverMenu(false);
                      }}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      I'm a Student
                    </Button>

                    {showStudentMenu && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-xl border border-border overflow-hidden animate-scale-in z-20">
                        <Link
                          to="/login-student"
                          className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
                        >
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-auto" />
                        </Link>
                        <Link
                          to="/register?role=student"
                          className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors border-t border-border"
                        >
                          Create Account
                          <ArrowRight className="w-4 h-4 ml-auto" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Driver Dropdown */}
                  <div className="relative">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base px-8 py-6 border-2 hover:bg-secondary"
                      onClick={() => {
                        setShowDriverMenu(!showDriverMenu);
                        setShowStudentMenu(false);
                      }}
                    >
                      <Car className="w-5 h-5 mr-2" />
                      I'm a Driver
                    </Button>

                    {showDriverMenu && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-xl border border-border overflow-hidden animate-scale-in z-20">
                        <Link
                          to="/login-driver"
                          className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
                        >
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-auto" />
                        </Link>
                        <Link
                          to="/register?role=driver"
                          className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors border-t border-border"
                        >
                          Register as Driver
                          <ArrowRight className="w-4 h-4 ml-auto" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 pt-8 border-t border-border/50">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-foreground font-display">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual Elements */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 w-64 p-4 rounded-2xl bg-card shadow-xl border border-border animate-float">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Ride Scheduled</p>
                      <p className="text-xs text-muted-foreground">Main Gate → MGH</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full" />
                  </div>
                </div>

                <div className="absolute bottom-12 -left-8 w-56 p-4 rounded-2xl bg-card shadow-xl border border-border animate-float" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Pool Ready</p>
                      <p className="text-xs text-muted-foreground">3 passengers joined</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Locations Section */}
      <section className="py-24">
        <div className="content-container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-gradient">NIT Jalandhar</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seamless connectivity across all major campus locations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Gate */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={campusMainGate}
                alt="NIT Jalandhar Main Gate"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  Popular Pickup Point
                </div>
                <h3 className="text-xl font-bold text-white">Main Gate</h3>
              </div>
            </div>

            {/* Admin Block */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={campusAdminBlock}
                alt="NIT Jalandhar Administrative Block"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <Building className="w-4 h-4" />
                  Administrative Area
                </div>
                <h3 className="text-xl font-bold text-white">Admin Block</h3>
              </div>
            </div>

            {/* Library */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={campusLibrary}
                alt="NIT Jalandhar Central Library"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <BookOpen className="w-4 h-4" />
                  Study Zone
                </div>
                <h3 className="text-xl font-bold text-white">Central Library</h3>
              </div>
            </div>

            {/* Hostels - Large card spanning 2 columns */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:col-span-2 lg:col-span-2">
              <img
                src={campusHostel}
                alt="NIT Jalandhar Hostels"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <Home className="w-4 h-4" />
                  Residential Area
                </div>
                <h3 className="text-xl font-bold text-white">Student Hostels</h3>
                <p className="text-white/70 text-sm mt-1">
                  Boys Hostels, Girls Hostels, Mega Hostels
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4">15+ Locations</h3>
              <p className="text-white/80 mb-6">
                All major campus spots covered for quick and easy rides
              </p>
              <Link to="/book">
                <Button className="bg-white text-primary hover:bg-white/90 w-full">
                  Book Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card">
        <div className="content-container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-gradient">CampusRide</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The smartest way to navigate your campus. Built by students, for students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-interactive group p-6"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] " />
        
        <div className="relative z-10 content-container text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ride Smarter?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students who've already made campus transit effortless.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register?role=student">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-base px-8 py-6 font-semibold"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login-student">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-base px-8 py-6"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                Campus<span className="text-primary">Ride</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CampusRide. Your Campus Transit Solution.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
