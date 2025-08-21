import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any credentials
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset functionality coming soon!");
  };

  const handleSignUp = () => {
    toast.info("Sign up functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/90 via-primary to-secondary/80 relative overflow-hidden">
      {/* Tractor Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20">
          <ApperIcon name="Tractor" className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-32 right-32">
          <ApperIcon name="Tractor" className="w-24 h-24 text-white" />
        </div>
        <div className="absolute top-1/2 left-1/3">
          <ApperIcon name="Wheat" className="w-20 h-20 text-white" />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <ApperIcon name="Sprout" className="w-16 h-16 text-white" />
        </div>
      </div>

      {/* Overlay Pattern */}
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
              <ApperIcon name="Tractor" className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">TractorFlow</h1>
            <p className="text-white/80">Agricultural Equipment Rental Management</p>
          </div>

          {/* Login Card */}
          <Card className="p-8 shadow-2xl backdrop-blur-sm bg-white/95">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email / Username"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email or username"
                required
                className="text-base"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="text-base"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-3"
                loading={loading}
                disabled={loading}
                icon="LogIn"
              >
                Login
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full text-lg py-3"
                onClick={handleSignUp}
                icon="UserPlus"
              >
                Sign Up
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <strong>Demo:</strong> Use any email and password to login
              </p>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              © 2024 TractorFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;