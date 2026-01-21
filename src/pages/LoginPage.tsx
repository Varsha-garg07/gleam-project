import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Car, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LoginPageProps {
  role: "student" | "driver";
}

const LoginPage = ({ role }: LoginPageProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - in real app this would call your auth API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock user for demo
      const mockUser = {
        _id: "user123",
        name: formData.email.split("@")[0],
        email: formData.email,
        role: role,
        token: "mock-token-123",
      };

      localStorage.setItem("campusRideUser", JSON.stringify(mockUser));
      
      toast.success("Login successful!");
      
      if (role === "driver") {
        navigate("/driver-dashboard");
      } else {
        navigate("/book");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = role === "driver" ? Car : GraduationCap;
  const title = role === "driver" ? "Driver Login" : "Student Login";
  const gradient = role === "driver" 
    ? "from-accent to-success" 
    : "from-primary to-accent";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
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
            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Sign in to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
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

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full py-6 text-base font-semibold bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to={`/register?role=${role}`}
                className="text-primary font-medium hover:underline"
              >
                Register as {role}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
