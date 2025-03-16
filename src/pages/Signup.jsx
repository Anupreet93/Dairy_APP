import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { UserIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/public/sign-up", { email, username, password });
      toast.success("Signup successful!");

      const loginResponse = await axiosInstance.post("/public/login", { username, password });
      localStorage.setItem("token", loginResponse.data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const initiateGoogleOAuth = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      "http://localhost:5173/login/auth/google/callback"
    )}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className={`w-full min-h-screen flex items-center justify-center transition-colors duration-300 ${
      darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-cyan-50 to-blue-100"
    }`}>
      {/* Dark Mode Toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-full backdrop-blur-lg bg-white/30 shadow-lg hover:scale-105 transition-transform"
      >
        {darkMode ? '🌞' : '🌙'}
      </button>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSignup}
          className={`p-8 rounded-3xl shadow-2xl backdrop-blur-lg border ${
            darkMode ? "bg-slate-800/30 border-slate-700" : "bg-white/30 border-slate-200"
          }`}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${
              darkMode ? "from-cyan-400 to-blue-400" : "from-blue-600 to-purple-500"
            } bg-clip-text text-transparent`}>
              Welcome to MyDiary
            </h1>
            <p className={`${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Start your personal journaling journey
            </p>
          </motion.div>

          {/* Form Fields */}
          <motion.div variants={containerVariants} className="space-y-6">
            {/* Username Input */}
            <motion.div variants={itemVariants} className="relative">
              <UserIcon className={`w-5 h-5 absolute left-4 top-3.5 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all ${
                  darkMode 
                    ? "bg-slate-700/50 border-slate-600 text-white" 
                    : "bg-white border-slate-200"
                } border focus:ring-2 focus:ring-blue-500`}
              />
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="relative">
              <EnvelopeIcon className={`w-5 h-5 absolute left-4 top-3.5 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all ${
                  darkMode 
                    ? "bg-slate-700/50 border-slate-600 text-white" 
                    : "bg-white border-slate-200"
                } border focus:ring-2 focus:ring-blue-500`}
              />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="relative">
              <LockClosedIcon className={`w-5 h-5 absolute left-4 top-3.5 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all ${
                  darkMode 
                    ? "bg-slate-700/50 border-slate-600 text-white" 
                    : "bg-white border-slate-200"
                } border focus:ring-2 focus:ring-blue-500`}
              />
            </motion.div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="mt-8">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : darkMode 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500" 
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
              } text-white shadow-lg hover:shadow-xl`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.div>

          {/* Social Login Section */}
          <motion.div variants={itemVariants} className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? "border-slate-700" : "border-slate-300"}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}>
                  or continue with
                </span>
              </div>
            </div>
          </motion.div>

          {/* Google Button */}
          <motion.div variants={itemVariants} className="mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={initiateGoogleOAuth}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-xl ${
                darkMode 
                  ? "bg-slate-700 hover:bg-slate-600 text-white" 
                  : "bg-white hover:bg-gray-50 text-gray-700"
              } border ${
                darkMode ? "border-slate-600" : "border-gray-300"
              } shadow-sm transition-all`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Sign up with Google</span>
            </motion.button>
          </motion.div>

          {/* Login Link */}
          <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
            <span className={`${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Already have an account?{" "}
            </span>
            <a 
              href="/login" 
              className={`font-semibold ${
                darkMode ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-500"
              } transition-colors`}
            >
              Log in
            </a>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Signup;