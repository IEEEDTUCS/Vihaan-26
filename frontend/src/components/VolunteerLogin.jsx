import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Environment variables
const API = import.meta.env.VITE_BACKEND_URL_VIHAAN;
const ADMIN_SECRET_KEY = import.meta.env.VITE_ADMIN_CREATION_KEY;

export default function VolunteerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mode Toggle: true = Login, false = Sign Up
  const [isLogin, setIsLogin] = useState(true);
  
  // Password Visibility Toggle
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle switching between Login and Sign Up
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(""); 
    setUsername("");
    setPassword("");
    setShowPassword(false); // Reset password visibility when switching modes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      return setError("Please enter both username and password.");
    }

    setLoading(true);

    if (isLogin) {
      // login
      try {
        await login(username, password, "admin");
        navigate("/volunteerDashboard"); 
      } catch (err) {
        setError(err.message || "Invalid credentials. Please try again.");
      } finally {
        setLoading(false);
      }

    } else {
      // signup
      try {
        if (!ADMIN_SECRET_KEY) {
          throw new Error("Admin creation key is missing from frontend .env file.");
        }

        const res = await fetch(`${API}/api/admin/create`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_SECRET_KEY 
          },
          body: JSON.stringify({ 
            username: username, 
            password: password, 
            role: "VOLUNTEER"
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Captures exact error from backend
          const backendError = data.error || data.message || "Failed to create account.";
          throw new Error(backendError);
        }

        // Success! Alert the user and snap back to the login view
        alert("Volunteer account created successfully! You can now log in.");
        setIsLogin(true); 
        setPassword(""); 
        setShowPassword(false);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-10 px-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100 transition-all duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? "Volunteer Portal" : "Volunteer Sign Up"}
          </h1>
          <p className="text-slate-500 mt-2">
            {isLogin ? "Sign in to access the check-in dashboard" : "Create your account using the master key"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder={isLogin ? "Enter username" : "e.g. volunteer_drishti"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all pr-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-indigo-600 outline-none transition-colors"
              >
                {showPassword ? (
                  // Eye Slash Icon (Hide)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye Icon (Show)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-4 disabled:opacity-50 transition-colors"
          >
            {loading 
              ? (isLogin ? "Authenticating..." : "Creating Account...") 
              : (isLogin ? "Login" : "Create Account")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "Need to register a new volunteer? " : "Already have an account? "}
          <button 
            type="button"
            onClick={toggleMode} 
            className="text-indigo-600 hover:text-indigo-800 font-bold outline-none"
          >
            {isLogin ? "Sign up here" : "Log in here"}
          </button>
        </div>
        
      </div>
    </div>
  );
}