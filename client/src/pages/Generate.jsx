import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../App";

const Generate = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [error, setError] = useState(null);

  const PHASES = [
    "Analyzing your idea...",
    "Analyzing your idea...",
    "Analyzing your idea...",
    "Designing layout...",
    "Designing layout...",
    "Designing layout...",
    "Generating UI...",
    "Generating UI...",
    "Generating UI...",
    "Adding animations...",
    "Adding animations...",
    "Adding animations...",
    "Finalizing website...",
  ];

  // 🔥 PROGRESS ANIMATION
  useEffect(() => {
    let interval;

    if (loading) {
      setProgress(0);
      setCurrentPhase(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 95) return prev + 1;
          return prev;
        });

        setCurrentPhase((prev) => {
          if (prev < PHASES.length - 1) return prev + 1;
          return prev;
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [loading]);

  // 🔥 GENERATE WEBSITE
  const handleGenerateWebsite = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      );

      setProgress(100);

      setTimeout(() => {
        navigate(`/editor/${result.data.websiteId}`);
      }, 500);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to generate");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/")}>
            <BiArrowBack className="size-[18px]" />
          </button>
          <h1 className="font-semibold">
            Genweb <span className="text-zinc-400">AI</span>
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            Build Website with
            <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>

          <p className="text-zinc-400 mb-10">
            This process may take a few seconds. We focus on quality ⚡
          </p>
        </motion.div>

        {/* TEXTAREA */}
        <div className="mb-8">
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Describe your website in detail..."
            className="w-full h-52 p-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:ring-1 focus:ring-white/30"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-400 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerateWebsite}
            disabled={!prompt.trim() || loading}
            className={`px-6 py-2 rounded-xl font-medium transition ${
              loading
                ? "bg-white/30 cursor-not-allowed"
                : "bg-white text-black hover:opacity-90"
            }`}
          >
            {loading ? "Generating..." : "Generate Website"}
          </button>
        </div>
      </div>

      {/* 🔥 LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center z-50">
          
          {/* PROGRESS BAR */}
          <div className="w-[300px] h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* PERCENT */}
          <p className="text-sm text-zinc-400 mb-2">{progress}%</p>

          {/* PHASE TEXT */}
          <p className="text-sm animate-pulse text-white">
            {PHASES[currentPhase]}
          </p>
        </div>
      )}
    </div>
  );
};

export default Generate;