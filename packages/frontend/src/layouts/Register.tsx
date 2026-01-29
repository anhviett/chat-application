import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RegisterInput } from "@/types/register-input";
import { authApi } from "@/api/auth";
import Button from "@/common/components/Button";
import {
  GoogleIcon,
  GitHubIcon,
  FacebookIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/common/components/icons";
import group_1 from "@/assets/images/group_1.svg";
import group_2 from "@/assets/images/group_2.svg";
import group_3 from "@/assets/images/group_3.svg";

const Register = () => {
  const [inputs, setInputs] = useState<RegisterInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputs.password !== inputs.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (inputs.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authApi.register({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        password: inputs.password,
        confirmPassword: inputs.confirmPassword,
      });

      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Email might already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#1a4b8c]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d3a6e] via-[#1a5a9e] to-[#2868a8]"></div>

      {/* Decorative 3D shapes */}
      <div className="absolute top-[5%] left-[50%] w-20 h-20">
        <img src={group_1} alt="Group_1" />
      </div>

      {/* Abstract shapes */}
      <div className="absolute top-[20%] left-[10%] opacity-40">
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
          <path
            d="M20 40C20 20 40 10 60 20C80 30 80 50 60 60C40 70 20 60 20 40Z"
            fill="#4a9eff"
            fillOpacity="0.5"
          />
          <path
            d="M50 30C50 15 70 10 85 20C100 30 95 50 80 55C65 60 50 45 50 30Z"
            fill="#6ab4ff"
            fillOpacity="0.6"
          />
        </svg>
      </div>
      <div className="absolute bottom-[15%] left-[5%] opacity-10">
        <img src={group_3} alt="Group_3" />
      </div>
      <div className="absolute top-[30%] right-[5%] opacity-30">
        <svg width="150" height="200" viewBox="0 0 150 200" fill="none">
          <path
            d="M75 10C75 10 120 50 120 100C120 150 75 190 75 190"
            stroke="#4a9eff"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="absolute bottom-[10%] right-[15%] opacity-40">
        <img src={group_2} alt="Group_2" />
      </div>

      {/* Large background card */}
      <div className="absolute w-[500px] h-[650px] bg-[#1a4a85]/50 rounded-3xl -rotate-3 backdrop-blur-sm"></div>

      {/* Glass morphism register card */}
      <div className="relative z-10 w-full max-w-[380px] mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-cyan-400">Your logo</h1>
          </div>
          <h2 className="text-xl font-semibold text-white mb-6">Register</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-white/80 text-sm font-medium block"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={inputs.firstName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/90 border border-white/20 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="text-white/80 text-sm font-medium block"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={inputs.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-3 bg-white/90 border border-white/20 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-white/80 text-sm font-medium block"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={inputs.email}
                onChange={handleChange}
                placeholder="username@gmail.com"
                className="w-full px-4 py-3 bg-white/90 border border-white/20 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-white/80 text-sm font-medium block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={inputs.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 bg-white/90 border border-white/20 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                  required
                />
                <Button
                  type="button"
                  onClick={togglePassword}
                  variant="outline"
                  size="small"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center border-0 bg-transparent text-gray-400 hover:text-gray-600 shadow-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-white/80 text-sm font-medium block"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={inputs.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 pr-12 bg-white/90 border border-white/20 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                  required
                />
                <Button
                  type="button"
                  onClick={toggleConfirmPassword}
                  variant="outline"
                  size="small"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center border-0 bg-transparent text-gray-400 hover:text-gray-600 shadow-none"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              variant="glass"
              size="large"
              fullWidth
              loading={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-white/60">or continue with</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="social"
              className="w-14 h-12"
              icon={<GoogleIcon />}
            />
            <Button
              type="button"
              variant="social"
              className="w-14 h-12"
              icon={<GitHubIcon />}
            />
            <Button
              type="button"
              variant="social"
              className="w-14 h-12"
              icon={<FacebookIcon />}
            />
          </div>

          <p className="text-center mt-6 text-white/70 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
