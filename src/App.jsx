import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import JournalEntryForm from "./Pages/JournalEntryForm";
import GoogleAuthCallback from "./components/GoogleAuthCallback"; // Ensure this component exists

const App = () => {
  const [theme, setTheme] = useState("serene");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const themeStyles = {
    serene: {
      background: "bg-gradient-to-br from-blue-50 to-cyan-100",
      text: "text-slate-800",
      accent: "bg-cyan-200/80",
      border: "border-cyan-300",
      paper: "bg-white/90 backdrop-blur-sm",
      button: "bg-gradient-to-r from-cyan-400 to-blue-400",
      shadow: "shadow-lg shadow-cyan-200/50"
    },
    sunrise: {
      background: "bg-gradient-to-br from-amber-100 to-orange-50",
      text: "text-orange-900",
      accent: "bg-amber-200/80",
      border: "border-amber-300",
      paper: "bg-orange-50/90 backdrop-blur-sm",
      button: "bg-gradient-to-r from-amber-400 to-orange-400",
      shadow: "shadow-lg shadow-amber-200/50"
    },
    royal: {
      background: "bg-gradient-to-br from-violet-50 to-purple-100",
      text: "text-purple-900",
      accent: "bg-violet-200/80",
      border: "border-violet-300",
      paper: "bg-white/90 backdrop-blur-sm",
      button: "bg-gradient-to-r from-violet-400 to-purple-400",
      shadow: "shadow-lg shadow-violet-200/50"
    },
    botanical: {
      background: "bg-gradient-to-br from-green-50 to-emerald-100",
      text: "text-emerald-900",
      accent: "bg-green-200/80",
      border: "border-green-300",
      paper: "bg-white/90 backdrop-blur-sm",
      button: "bg-gradient-to-r from-green-400 to-emerald-400",
      shadow: "shadow-lg shadow-green-200/50"
    },
    midnight: {
      background: "bg-gradient-to-br from-slate-800 to-slate-900",
      text: "text-slate-100",
      accent: "bg-slate-600/80",
      border: "border-slate-500",
      paper: "bg-slate-700/90 backdrop-blur-sm",
      button: "bg-gradient-to-r from-slate-500 to-slate-600",
      shadow: "shadow-lg shadow-slate-800/50"
    }
  };

  const ThemeSelector = () => (
    <motion.div 
      className="fixed bottom-6 left-6 flex gap-3 z-50 p-2 rounded-full bg-white/20 backdrop-blur-sm"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
    >
      {Object.keys(themeStyles).map((themeKey) => (
        <motion.button
          key={themeKey}
          onClick={() => setTheme(themeKey)}
          className={`w-9 h-9 rounded-full shadow-lg transition-transform ${
            theme === themeKey ? "ring-2 ring-white scale-110" : "scale-100"
          }`}
          style={{
            background: themeStyles[themeKey].button
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          title={`${themeKey.charAt(0).toUpperCase() + themeKey.slice(1)} Theme`}
        />
      ))}
    </motion.div>
  );

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Router>
      <div className={`min-h-screen w-full ${themeStyles[theme].background} relative transition-colors duration-300`}>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: themeStyles[theme].paper,
            color: themeStyles[theme].text,
            border: `1px solid ${themeStyles[theme].border}`,
            fontFamily: "'Caveat', cursive",
            fontSize: "1.2rem",
            backdropFilter: 'blur(4px)'
          },
        }} />

        <ThemeSelector />

        {/* Navigation Bar */}
        <motion.nav 
          variants={navVariants}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", stiffness: 100 }}
          className={`fixed w-full z-40 p-4 ${themeStyles[theme].shadow} ${themeStyles[theme].paper} border-b ${themeStyles[theme].border} transition-colors duration-300`}
        >
          <div className="container mx-auto flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="flex items-center gap-4"
            >
              <Link 
                to="/dashboard" 
                className={`text-3xl font-bold ${themeStyles[theme].text}`}
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                <motion.span className="inline-block">
                  MyDiary
                </motion.span>
                <motion.span 
                  className="ml-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  📖
                </motion.span>
              </Link>
            </motion.div>

            <div className="flex gap-4 items-center">
              <AnimatePresence mode="wait">
                {!localStorage.getItem("token") ? (
                  <motion.div
                    key="auth-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/login"
                        className={`px-6 py-2 rounded-full ${themeStyles[theme].button} text-white ${themeStyles[theme].shadow} transition-all`}
                        style={{ fontFamily: "'Caveat', cursive" }}
                      >
                        Login
                      </Link>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/signup"
                        className={`px-6 py-2 rounded-full ${themeStyles[theme].button} text-white ${themeStyles[theme].shadow} transition-all`}
                        style={{ fontFamily: "'Caveat', cursive" }}
                      >
                        Signup
                      </Link>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logout-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                      className={`px-6 py-2 rounded-full ${themeStyles[theme].button} text-white ${themeStyles[theme].shadow} transition-all`}
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-24 min-h-screen px-4"
        >
          <div className={`max-w-6xl mx-auto p-8 rounded-xl ${themeStyles[theme].paper} ${themeStyles[theme].shadow} border ${themeStyles[theme].border} transition-colors duration-300`}>
            <Routes>
              <Route path="/login" element={<Login theme={theme} />} />
              <Route path="/signup" element={<Signup theme={theme} />} />
              <Route path="/login/auth/google/callback" element={<GoogleAuthCallback />} />
              <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} theme={theme} />} />
              <Route path="/entry/new" element={<ProtectedRoute Component={JournalEntryForm} theme={theme} />} />
              <Route path="/entry/edit/:id" element={<ProtectedRoute Component={JournalEntryForm} theme={theme} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </motion.main>

        {/* Decorative Page Curl */}
        <div className="fixed bottom-0 right-0 w-32 h-32 bg-gradient-to-bl from-transparent to-current opacity-10" />
      </div>
    </Router>
  );
};

export default App;
