import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";

const Dashboard = ({ theme = "vintage" }) => {
  const [entries, setEntries] = useState([]);
  const [username, setUsername] = useState("");
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editingEntryData, setEditingEntryData] = useState({});

  const themeStyles = {
    vintage: {
      background: "bg-[#f5e6d3]",
      text: "text-stone-800",
      accent: "bg-amber-600/20 hover:bg-amber-600/30",
      border: "border-amber-700",
      binding: "bg-[#5d432c]",
      paper: "bg-[#f5e6d3]",
      paperTexture: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #e1c7a9 24px)",
      button: "bg-amber-600/20 hover:bg-amber-600/30"
    },
    modern: {
      background: "bg-white",
      text: "text-stone-700",
      accent: "bg-stone-200 hover:bg-stone-300",
      border: "border-stone-300",
      binding: "bg-stone-800",
      paper: "bg-white",
      paperTexture: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #e5e5e5 24px)",
      button: "bg-stone-200 hover:bg-stone-300"
    },
    moody: {
      background: "bg-stone-700",
      text: "text-stone-100",
      accent: "bg-stone-600/50 hover:bg-stone-500/50",
      border: "border-stone-500",
      binding: "bg-stone-900",
      paper: "bg-stone-600",
      paperTexture: "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #4b5563 24px)",
      button: "bg-stone-600/50 hover:bg-stone-500/50"
    }
  };


  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/user/me");
      console.log("🔹 User Data:", response.data);
      setUsername(response.data.username);
    } catch (error) {
      console.error(
        "⚠️ Failed to fetch user details:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch user details.");
    }
  }, []);

  // Fetch journal entries
  const fetchEntries = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/journal");
      setEntries(response.data);
    } catch (error) {
      toast.error("Failed to fetch entries.");
    }
  }, []);

  // Fetch user details & entries on mount
  useEffect(() => {
    fetchUserDetails();
    fetchEntries();
  }, [fetchUserDetails, fetchEntries]);

  // Handle delete (single or all)
  const handleDelete = async (id) => {
    try {
      const entryId =
        typeof id === "object" && id !== null ? (id._id || id.id) : id;
      console.log("Deleting entry with id:", entryId);

      if (entryId !== undefined) {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this entry?"
        );
        if (confirmDelete) {
          await axiosInstance.delete(`/journal/${username}/${entryId}`);
          setEntries((prevEntries) =>
            prevEntries.filter((entry) => entry._id !== entryId)
          );
          toast.success("Entry deleted successfully.");
        }
      } else {
        const confirmDeleteAll = window.confirm(
          "Are you sure you want to delete all entries?"
        );
        if (confirmDeleteAll) {
          await axiosInstance.delete("/journal/delete-all");
          setEntries([]);
          toast.success("All entries deleted successfully.");
        }
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete entries.";
      toast.error(`Error: ${errorMsg}`);
    }
  };

  // Start editing an entry
  const startEditing = (entry) => {
    setEditingEntryId(entry._id);
    setEditingEntryData({
      title: entry.title,
      content: entry.content,
      sentiment: entry.sentiment || "",
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEditingEntryData({});
  };

  // Handle update (PUT request)
  const handleUpdate = async () => {
    try {
      if (!editingEntryId) {
        toast.error("Entry ID is undefined, cannot update.");
        return;
      }
      const entryId =
        typeof editingEntryId === "object"
          ? (editingEntryId._id || editingEntryId.id).toString()
          : editingEntryId.toString();
      console.log("Updating entry with id:", entryId);

      await axiosInstance.put(`/journal/${username}/${entryId}`, editingEntryData);

      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry._id.toString() === entryId ? { ...entry, ...editingEntryData } : entry
        )
      );
      toast.success("Entry updated successfully.");
      setEditingEntryId(null);
      setEditingEntryData({});
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update entry.";
      toast.error(`Error: ${errorMsg}`);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.95 },
  };

  const entryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
    hover: { scale: 1.02, rotate: -0.5 },
  };

  return (
    <div className={`min-h-screen ${themeStyles[theme].background} relative transition-colors duration-300`}>
      {/* Decorative Binding Edge */}
      <div className={`fixed left-0 top-0 h-full w-8 ${themeStyles[theme].binding} 
        bg-gradient-to-b from-[#ffffff11] to-[#00000011] z-20`}>
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ffffff33] to-transparent" />
      </div>

      <div className="ml-8 pl-4 pr-6 py-8 min-h-screen">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-xl shadow-lg gap-4 
            ${themeStyles[theme].border} ${themeStyles[theme].paper}`}
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          <h1 className={`text-4xl font-bold ${themeStyles[theme].text}`}>
            {username}'s Diary <span className="ml-4 animate-pulse">📖</span>
          </h1>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete()}
              className={`px-6 py-3 rounded-full text-xl ${themeStyles[theme].button} ${themeStyles[theme].text} shadow-md`}
            >
              🗑️ Clear All
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.assign("/entry/new")}
              className={`px-6 py-3 rounded-full text-xl ${themeStyles[theme].button} ${themeStyles[theme].text} shadow-md`}
            >
              ✍️ New Entry
            </motion.button>
          </div>
        </motion.div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-xl shadow-2xl ${themeStyles[theme].border} ${themeStyles[theme].paper}`}
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {/* Entry Content */}
                {editingEntryId === entry._id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingEntryData.title || ""}
                      onChange={(e) => setEditingEntryData({ ...editingEntryData, title: e.target.value })}
                      className={`w-full text-2xl bg-transparent border-b-2 ${themeStyles[theme].border} ${themeStyles[theme].text}`}
                      placeholder="Entry Title"
                    />
                    <TextareaAutosize
                      value={editingEntryData.content || ""}
                      onChange={(e) => setEditingEntryData({ ...editingEntryData, content: e.target.value })}
                      minRows={4}
                      className={`w-full bg-transparent ${themeStyles[theme].text} placeholder-opacity-50`}
                      placeholder="Write your thoughts..."
                      style={{
                        backgroundImage: themeStyles[theme].paperTexture,
                        lineHeight: "1.75rem",
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <h2 className={`text-3xl mb-4 font-bold ${themeStyles[theme].text}`}>
                      {entry.title}
                    </h2>
                    <p className={`text-xl ${themeStyles[theme].text} leading-relaxed`}>
                      {entry.content}
                    </p>
                  </>
                )}

                {/* Entry Metadata */}
                <div className={`mt-4 text-sm ${themeStyles[theme].text} opacity-70`}>
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {editingEntryId === entry._id ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={handleUpdate}
                        className={`p-2 rounded-full ${themeStyles[theme].accent} ${themeStyles[theme].text}`}
                      >
                        ✔️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={handleCancelEdit}
                        className={`p-2 rounded-full ${themeStyles[theme].accent} ${themeStyles[theme].text}`}
                      >
                        ✖️
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => startEditing(entry)}
                        className={`p-2 rounded-full ${themeStyles[theme].accent} ${themeStyles[theme].text}`}
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDelete(entry._id)}
                        className={`p-2 rounded-full ${themeStyles[theme].accent} ${themeStyles[theme].text}`}
                      >
                        🗑️
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Decorative Page Curl */}
        <div className="fixed bottom-0 right-0 w-32 h-32 bg-gradient-to-bl from-transparent to-current opacity-10" />
      </div>
    </div>
  );
};

export default Dashboard;
