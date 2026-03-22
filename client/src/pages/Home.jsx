import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../components/Login";
import { useSelector } from "react-redux";
import { SiAkiflow } from "react-icons/si";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import logo from "../assets/BuildlyLogo.png"
import backgroundImage from "../assets/background.png"


const Home = () => {
  const highlights = [
    "AI Generated Code",
    "fully Responsive Layout",
    "production Ready Output",
  ];

  const [openLogin, setOpenLogin] = useState(false);
  const [profile, setOpenProfile] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const nevigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      window.location.reload(); // simple reset
    } catch (error) {
      console.log(error);
    }
  };

  return (
<div
  style={{ backgroundImage: `url(${backgroundImage})` }}
  className="relative min-h-screen text-white overflow-hidden bg-cover bg-center"
>      {/* HEADER */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className=" flex  gap-2 items-center justify-center text-lg font-semibold tracking-wide">
          <img src={logo} className="w-15" alt="" />
          <span>
            Buildly

          </span>
          </div>

          <div className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer">
            Pricing
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3 relative">
            {/* Credits (Desktop only) */}
            {userData && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-white/5 border border-white/10 backdrop-blur-md shadow-md
                hover:bg-white/10 transition">

                <SiAkiflow className="text-purple-400 text-lg" />
                <span className="text-sm text-zinc-400">Credits</span>
                <span className="text-sm font-semibold text-white">
                  {userData?.user?.credits} +
                </span>
              </div>
            )}

            {/* AUTH BUTTON / AVATAR */}
            {!userData ? (
              <button
                onClick={() => setOpenLogin(true)}
                className="px-4 py-2 rounded-lg border-2 border-white/20 hover:bg-white/10 text-sm"
              >
                Get Started
              </button>
            ) : (
              <button
                onClick={() => setOpenProfile(!profile)}
                className="flex items-center"
              >
                <img
                  src={
                    userData.user.avatar ||
                    `https://ui-avatars.com/api/?name=${userData.user.name}`
                  }
                  className="w-9 h-9 rounded-full border border-white/20 object-cover hover:scale-105 transition"
                  alt=""
                />
              </button>
            )}

            {/* PROFILE DROPDOWN */}
            <AnimatePresence>
              {profile && userData && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-14 w-72 rounded-2xl 
                  bg-[#0b0b0b] border border-white/10 backdrop-blur-xl 
                  shadow-[0_20px_80px_rgba(0,0,0,0.8)] p-5 z-50"
                >
                  {/* USER INFO */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        userData.user.avatar ||
                        `https://ui-avatars.com/api/?name=${userData.user.name}`
                      }
                      className="w-10 h-10 rounded-full border border-white/20"
                      alt=""
                    />
                    <div>
                      <h3 className="text-sm font-semibold">
                        {userData.user.name}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {userData.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Credits (Mobile view) */}
                  <div className="md:hidden flex items-center justify-between px-3 py-2 mb-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-sm text-zinc-400">Credits</span>
                    <span className="text-sm font-semibold">
                      {userData?.user?.credits}
                    </span>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col gap-2">
                    <button 
                        onClick={()=>nevigate("/dashboard")}
                        className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-sm text-red-400 transition"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* HERO */}
      <section className="pt-44 pb-32 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Build Stunning Websites <br />
          <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            With AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
        >
          Describe your idea and let AI generate a modern responsive,
          production-ready website
        </motion.p>

        <button
          onClick={()=>nevigate("/dashboard")}
          className="mt-12 mx-auto max-w-40 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
        >
         {userData ? "Go to Dashboard" : "Get Started"}
        </button>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-8"
            >
              <h1 className="text-xl font-semibold mb-3">{h}</h1>
              <p className="text-sm text-zinc-400">
                GenWeb.ai builds real website -clear code, animations,
                responsiveness and scalable structure.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-400">
        &copy; {new Date().getFullYear()} GenWeb.ai
      </footer>

      {/* LOGIN MODAL */}
      {openLogin && (
        <Login open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
};

export default Home;