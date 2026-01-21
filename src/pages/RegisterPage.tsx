import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Building,
  ArrowLeft,
  Car,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlRole = new URLSearchParams(location.search).get("role") || "student";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    studentId: "",
    hostelOrBlock: "",
    phone: "",
    licenseNumber: "",
    role: urlRole,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: urlRole }));
  }, [urlRole]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user registration
      const mockUser = {
        _id: "user" + Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        token: "mock-token-" + Date.now(),
      };

      localStorage.setItem("campusRideUser", JSON.stringify(mockUser));

      toast.success("Registration successful!");

      if (formData.role === "driver") {
        navigate("/driver-dashboard");
      } else {
        navigate("/book");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDriver = formData.role === "driver";
  const Icon = isDriver ? Car : GraduationCap;
  const title = isDriver ? "Driver Registration" : "Student Registration";
  const subtitle = isDriver
    ? "Register as a driver to manage ride requests."
    : "Sign up to start scheduling your campus rides.";
  const gradient = isDriver ? "from-accent to-success" : "from-primary to-accent";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="card-elevated animate-fade-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-secondary rounded-xl mb-6">
            <Link
              to="/register?role=student"
              className={`flex-1 py-2.5 text-center text-sm font-medium rounded-lg transition-all ${
                !isDriver
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Student
            </Link>
            <Link
              to="/register?role=driver"
              className={`flex-1 py-2.5 text-center text-sm font-medium rounded-lg transition-all ${
                isDriver
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Driver
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  placeholder="John Doe"
                  className="input-styled pl-12"
                />
              </div>
            </div>

            {/* Student-specific fields */}
            {!isDriver && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Student ID <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={onChange}
                      required
                      placeholder="2021CS1234"
                      className="input-styled pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hostel / Block <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="hostelOrBlock"
                      value={formData.hostelOrBlock}
                      onChange={onChange}
                      required
                      placeholder="BH-3"
                      className="input-styled pl-12"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Driver-specific fields */}
            {isDriver && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onChange}
                      required
                      placeholder="+91 98765 43210"
                      className="input-styled pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    License Number <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={onChange}
                      placeholder="DL1234567890"
                      className="input-styled pl-12"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                  placeholder="you@example.com"
                  className="input-styled pl-12"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className="input-styled pl-12"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className="input-styled pl-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full py-6 text-base font-semibold bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity mt-6`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to={isDriver ? "/login-driver" : "/login-student"}
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
