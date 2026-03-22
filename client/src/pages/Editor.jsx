// WebsiteEditor.jsx - Update the top bar section
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { BiCode, BiDesktop, BiRocket, BiMessage, BiLink } from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { motion , AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";

const WebsiteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [copied, setCopied] = useState(false);

  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [updationPrompt, setUpdationPrompt] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [showCode, setShowCode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);

  const iframeRef = useRef(null);

  const thingkingSteps = [
    "Understanding your request....",
    "Planning layout changes...",
    "Applying animations...",
    "Finalizing update...",
  ];

  // 🔥 DEPLOY FUNCTION
  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const result = await axios.get(
        `${serverUrl}/api/website/deploy?id=${id}`,
        { withCredentials: true }
      );
      
      setWebsite(prev => ({ 
        ...prev, 
        deployed: true, 
        deployUrl: result.data.url 
      }));
      
      alert("Website deployed successfully!");
    } catch (error) {
      console.error("Deploy error:", error);
      alert(error.response?.data?.message || "Failed to deploy website");
    } finally {
      setDeploying(false);
    }
  };
  
  // 🔥 COPY LINK FUNCTION
  const copyLink = () => {
    if (website?.deployUrl) {
      navigator.clipboard.writeText(website.deployUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // 🔥 UPDATE
  const handleupdate = async () => {
    setUpdateLoading(true);

    setMessages((m) => [...m, { role: "user", content: updationPrompt }]);

    try {
      const result = await axios.post(
        `${serverUrl}/api/website/update/${id}`,
        { prompt: updationPrompt },
        { withCredentials: true }
      );

      setCode(result.data.code);
      setUpdationPrompt("");

      setMessages((m) => [
        ...m,
        { role: "ai", content: result.data.message },
      ]);
    } catch (err) {
      console.log(err);
    }

    setUpdateLoading(false);
  };

  // 🔥 THINKING STEPS
  useEffect(() => {
    let interval;

    if (updateLoading) {
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep((prev) =>
          prev < thingkingSteps.length - 1 ? prev + 1 : prev
        );
      }, 1200);
    }

    return () => clearInterval(interval);
  }, [updateLoading]);

  // 🔥 FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          { withCredentials: true }
        );

        setWebsite(res.data);
        setCode(res.data.latestCode);
        setMessages(res.data.conversation || []);
      } catch (err) {
        setError("Failed to load");
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  // 🔥 IFRAME
  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="h-screen flex bg-[#0f0f0f] text-white overflow-hidden">

      {/* CHAT PANEL */}
      <aside className={`fixed lg:static z-50 bg-black w-[320px] lg:w-[350px] h-full border-r border-white/10 transition-all duration-300
        ${showChatMobile ? "left-0" : "-left-full"} lg:left-0 flex flex-col`}>

        <Header />

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`${m.role === "user" ? "text-right" : ""}`}>
              <div className={`inline-block px-4 py-2 rounded-2xl text-sm
                ${m.role === "user" ? "bg-white text-black" : "bg-white/5 text-gray-300"}`}>
                {m.content}
              </div>
            </div>
          ))}

          {updateLoading && (
            <div className="text-sm text-gray-400 animate-pulse">
              {thingkingSteps[currentStep]}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/10 flex gap-2">
          <input
            value={updationPrompt}
            onChange={(e) => setUpdationPrompt(e.target.value)}
            placeholder="Describe changes..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
            onKeyPress={(e) => e.key === 'Enter' && handleupdate()}
          />
          <button 
            onClick={handleupdate} 
            disabled={!updationPrompt.trim() || updateLoading}
            className="bg-white text-black px-3 rounded-xl disabled:opacity-50"
          >
            <BsSend />
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-14 flex justify-between items-center px-4 border-b border-white/10 bg-black/70 backdrop-blur">

          <div className="flex items-center gap-3">
            {/* MOBILE CHAT BUTTON */}
            <button onClick={() => setShowChatMobile(true)} className="lg:hidden">
              <BiMessage size={20} />
            </button>

            <span className="text-sm text-gray-400">Live Preview</span>
          </div>

          <div className="flex items-center gap-2">

  {/* DEPLOY / SHARE */}
  {website?.deployed ? (
    <button
      onClick={copyLink}
      className="group flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium 
      bg-green-500/10 text-green-400 border border-green-500/20
      hover:bg-green-500/20 hover:scale-[1.03] active:scale-[0.97]
      transition-all duration-200 shadow-sm hover:shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500/40"
    >
      <BiLink className="text-base group-hover:rotate-12 transition" />
      {copied ? "Copied!" : "Share"}
    </button>
  ) : (
    <button
      onClick={handleDeploy}
      disabled={deploying}
      className="group flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium 
      bg-gradient-to-r from-purple-600 to-indigo-600 text-white
      hover:from-purple-700 hover:to-indigo-700 hover:scale-[1.03]
      active:scale-[0.97] transition-all duration-200
      shadow-md hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40
      disabled:opacity-50"
    >
      <BiRocket className="text-base group-hover:-translate-y-0.5 transition" />
      {deploying ? "Deploying..." : "Deploy"}
    </button>
  )}

  {/* CODE BUTTON */}
  <button
    onClick={() => {
      setShowCode(true);
      setShowChatMobile(false);
    }}
    className="p-2 rounded-lg bg-white/5 border border-white/10 
    hover:bg-white/10 hover:scale-[1.05] active:scale-[0.95]
    transition-all duration-200 shadow-sm hover:shadow-white/10
    focus:outline-none focus:ring-2 focus:ring-white/20"
  >
    <BiCode className="text-lg" />
  </button>

  {/* PREVIEW BUTTON */}
  <button
    onClick={() => setShowFullPreview(true)}
    className="p-2 rounded-lg bg-white/5 border border-white/10 
    hover:bg-white/10 hover:scale-[1.05] active:scale-[0.95]
    transition-all duration-200 shadow-sm hover:shadow-white/10
    focus:outline-none focus:ring-2 focus:ring-white/20"
  >
    <BiDesktop className="text-lg" />
  </button>

</div>
        </div>

        {/* PREVIEW */}
        <iframe ref={iframeRef} className="flex-1 bg-white" title="Website Preview" />
      </div>

      {/* CODE EDITOR */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="absolute right-0 top-0 w-full lg:w-[60%] h-full bg-[#1e1e1e] z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span>index.html</span>
              <button onClick={() => setShowCode(false)}>
                <IoClose />
              </button>
            </div>

            <Editor
              value={code}
              language="html"
              theme="vs-dark"
              onChange={(v) => setCode(v)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL PREVIEW */}
      <AnimatePresence>
        {showFullPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
          >
            <button
              onClick={() => setShowFullPreview(false)}
              className="absolute top-4 right-4 bg-black/90 backdrop-blur px-4 py-2 rounded-full hover:bg-white/20 transition flex items-center gap-2 z-10"
            >
              <IoClose /> Close
            </button>

            <iframe srcDoc={code} className="w-full h-full bg-white" title="Full Preview" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function Header() {
    return (
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
        <span>{website?.title}</span>
        <button onClick={() => setShowChatMobile(false)} className="lg:hidden">
          <IoClose />
        </button>
      </div>
    );
  }
};

export default WebsiteEditor;