import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from 'react-textarea-autosize';

const themeStyles = {
  vintage: {
    background: "bg-gradient-to-br from-amber-100 to-amber-50",
    formBg: "bg-[#f5e6d3]",
    border: "border-amber-700",
    text: "text-stone-800",
    accent: "bg-amber-600/20",
    accentHover: "hover:bg-amber-600/30",
    paperTexture: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #e1c7a9 24px)",
    binding: "bg-[#5d432c]",
  },
  modern: {
    background: "bg-gradient-to-br from-stone-100 to-stone-50",
    formBg: "bg-white",
    border: "border-stone-300",
    text: "text-stone-700",
    accent: "bg-stone-200",
    accentHover: "hover:bg-stone-300",
    paperTexture: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #e5e5e5 24px)",
    binding: "bg-stone-800",
  },
  moody: {
    background: "bg-gradient-to-br from-stone-800 to-stone-900",
    formBg: "bg-stone-700",
    border: "border-stone-500",
    text: "text-stone-100",
    accent: "bg-stone-600/50",
    accentHover: "hover:bg-stone-500/50",
    paperTexture: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #4b5563 24px)",
    binding: "bg-stone-900",
  },
};

const availableFonts = [
  "Caveat", 
  "Pacifico", 
  "Dancing Script", 
  "Sacramento", 
  "Shadows Into Light", 
  "Homemade Apple",
  "Nanum Pen Script",
  "Covered By Your Grace"
];

const layoutOptions = {
  classic: "max-w-2xl",
  compact: "max-w-md",
  wide: "max-w-4xl",
};

const JournalEntryForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState("HAPPY");
  const [theme, setTheme] = useState("vintage");
  const [font, setFont] = useState("Caveat");
  const [layout, setLayout] = useState("classic");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchEntry = async () => {
    if (id) {
      try {
        const response = await axiosInstance.get(`/journal/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setSentiment(response.data.sentiment);
      } catch (error) {
        toast.error("Failed to fetch entry.");
      }
    }
  };

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, content, sentiment };
      let response;
      if (id) {
        response = await axiosInstance.put(`/journal/${id}`, payload);
      } else {
        response = await axiosInstance.post("/journal", payload);
      }
      toast.success(id ? "Entry updated successfully." : "Entry created successfully.");
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Failed to save entry.");
    }
  };

  return (
    <div className={`${themeStyles[theme].background} min-h-screen relative pb-12 px-4`}>
      {/* Floating Menu Button */}
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed z-50 bottom-6 right-6 p-3 rounded-full shadow-xl bg-white/90 backdrop-blur-sm hover:scale-105 transition-transform"
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </motion.button>

      {/* Settings Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-64 bg-white/95 backdrop-blur-lg z-40 shadow-2xl p-6"
          >
            <h3 className="text-xl font-bold mb-6">Diary Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-current"
                >
                  <option value="vintage">Vintage</option>
                  <option value="modern">Modern</option>
                  <option value="moody">Moody</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Font Style</label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-current"
                  style={{ fontFamily: font }}
                >
                  {availableFonts.map((f) => (
                    <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Layout</label>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-current"
                >
                  {Object.keys(layoutOptions).map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diary Content */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`relative mx-auto ${layoutOptions[layout]} w-full shadow-2xl rounded-xl overflow-hidden mt-20 md:mt-24
          transition-all duration-300 ${isMenuOpen ? 'mr-64' : ''}`}
        style={{ fontFamily: font }}
      >
        {/* Leather Binding */}
        <div className={`absolute left-0 top-0 h-full w-8 md:w-12 ${themeStyles[theme].binding} rounded-l-xl
          bg-gradient-to-b from-[#ffffff11] to-[#00000011]`} />
        
        {/* Stitched Binding Effect */}
        <div className="absolute left-8 md:left-12 top-0 h-full w-1 bg-gradient-to-b from-[#ffffff33] to-transparent" />
        <div className="absolute left-8 md:left-12 top-0 h-full w-px bg-black/10" />

        <motion.form onSubmit={handleSubmit} className="ml-12 md:ml-16 p-6 md:p-10 relative">
          {/* Date Display */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg md:text-2xl mb-6 ${themeStyles[theme].text} font-medium italic`}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </motion.div>

          {/* Title Field */}
          <motion.div 
            whileHover={{ translateX: 5 }}
            className="mb-6 relative"
          >
            <input
              type="text"
              placeholder="My Diary Entry..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`w-full text-3xl md:text-4xl font-bold bg-transparent focus:outline-none ${
                themeStyles[theme].text
              } placeholder-gray-500/70 italic`}
              style={{ 
                fontFamily: font,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            />
            <div className={`absolute bottom-0 h-px w-full ${themeStyles[theme].border.replace("border", "bg")}`} />
          </motion.div>

          {/* Content Field */}
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="mb-8 relative"
          >
            <TextareaAutosize
              placeholder="Begin writing your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minRows={12}
              className={`w-full text-xl md:text-2xl bg-transparent focus:outline-none resize-none ${
                themeStyles[theme].text
              } px-4 py-2 leading-relaxed tracking-wide`}
              style={{
                backgroundImage: themeStyles[theme].paperTexture,
                fontFamily: font,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            />
            {/* Ink Blot Decoration */}
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#00000008] rounded-full blur-xl" />
          </motion.div>

          {/* Sentiment Selection */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8"
          >
            <span className={`text-xl ${themeStyles[theme].text} italic`}>Current Mood:</span>
            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              className={`text-xl px-6 py-2 rounded-full transition-all ${
                themeStyles[theme].accent
              } ${themeStyles[theme].accentHover} focus:outline-none shadow-sm`}
              style={{ fontFamily: font }}
            >
              <option value="HAPPY">😊 Joyful</option>
              <option value="SAD">😢 Melancholy</option>
              <option value="ANGRY">😠 Frustrated</option>
              <option value="NEUTRAL">😐 Contemplative</option>
              <option value="ANXIOUS">😰 Apprehensive</option>
            </select>
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            className="sticky bottom-6 md:static text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              className={`inline-flex items-center px-12 py-4 rounded-full text-xl font-bold transition-all ${
                themeStyles[theme].accent
              } ${themeStyles[theme].accentHover} shadow-lg gap-3`}
              style={{ fontFamily: font }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {id ? "Update Entry" : "Seal Entry"}
            </button>
          </motion.div>
        </motion.form>

        {/* Aged Paper Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 mix-blend-multiply" />
      </motion.div>
    </div>
  );
};

export default JournalEntryForm;