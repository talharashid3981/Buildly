// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiLink, BiRocket } from "react-icons/bi";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
    
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deployingId, setDeployingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // 🔥 DEPLOY FUNCTION
  const handleDeploy = async (id, e) => {
    e.stopPropagation(); // Prevent card click
    setDeployingId(id);
    
    try {
      const result = await axios.get(
        `${serverUrl}/api/website/deploy?id=${id}`,
        { withCredentials: true }
      );
      
      // Update the website in the list
      setWebsites(prev => prev.map(site => 
        site._id === id 
          ? { ...site, deployed: true, deployUrl: result.data.url }
          : site
      ));
      
      // Show success message
      console.log("Deployed successfully:", result.data.url);
    } catch (error) {
      console.error("Deploy error:", error);
      alert(error.response?.data?.message || "Failed to deploy website");
    } finally {
      setDeployingId(null);
    }
  };
  
  // 🔥 COPY LINK FUNCTION
  const copyLink = (url, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // 🔥 FETCH ALL WEBSITES
  useEffect(() => {
    const handleGetAllWebsite = async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-all`,
          { withCredentials: true }
        );

        setWebsites(result.data || []);
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Something went wrong");
      }
      setLoading(false);
    };

    handleGetAllWebsite();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")}>
              <BiArrowBack className="size-[18px]" />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          <button
            onClick={() => navigate("/generate")}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:opacity-90 transition"
          >
            + New Website
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* USER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm text-zinc-400 mb-1">Welcome Back 👋</p>
          <h1 className="text-3xl font-bold">
            {userData?.user?.name || "User"}
          </h1>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-zinc-400">
            Loading your websites...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center text-red-400">{error}</div>
        )}

        {/* EMPTY STATE */}
        {!loading && websites.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-xl font-semibold mb-2">
              No Websites Found
            </h2>
            <p className="text-zinc-400 mb-6">
              Start by creating your first website 🚀
            </p>

            <button
              onClick={() => navigate("/generate")}
              className="px-5 py-2 rounded-lg bg-white text-black"
            >
              Create Website
            </button>
          </div>
        )}

        {/* WEBSITES GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((site, i) => (
            <motion.div
  key={site._id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.05 }}
  onClick={() => navigate(`/editor/${site._id}`)}
  className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition group flex flex-col justify-between"
>
  {/* TOP CONTENT */}
  <div>
    <h2 className="text-lg font-semibold mb-2 group-hover:text-white">
      {site.title || "Untitled Website"}
    </h2>

    <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
      {site.description || "No description available"}
    </p>

    <span className="text-xs text-zinc-500">
      {new Date(site.createdAt).toLocaleDateString()}
    </span>
  </div>

  {/* 🔥 BOTTOM ACTIONS */}
  <div className="mt-5 flex gap-2">
    
    {/* OPEN BUTTON (only if deployed) */}
    {site.deployed && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(site.deployUrl, "_blank");
        }}
        className="flex-1 py-2 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition"
      >
        Open
      </button>
    )}

    {/* DEPLOY OR SHARE */}
    {site.deployed ? (
      <button
        onClick={(e) => copyLink(site.deployUrl, site._id, e)}
        className="flex-1 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm font-medium hover:bg-green-500/20 transition flex items-center justify-center gap-1"
      >
        <BiLink />
        {copiedId === site._id ? "Copied!" : "Copy Link"}
      </button>
    ) : (
      <button
        onClick={(e) => handleDeploy(site._id, e)}
        disabled={deployingId === site._id}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-1"
      >
        <BiRocket />
        {deployingId === site._id ? "Deploying..." : "Deploy"}
      </button>
    )}
  </div>
</motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;