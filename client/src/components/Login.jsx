import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from '../firebase.js';
import { signInWithPopup } from "firebase/auth";
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import toast from 'react-hot-toast';

const Login = ({ open, onClose }) => {
  const dispatch = useDispatch();
  
  const handleGoogleAuth = async () => {
    const loadingToast = toast.loading("Signing in with Google...");
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      const response = await axios.post(`${serverUrl}/api/auth/google`, {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      }, {
        withCredentials: true,
      });
      
      dispatch(setUserData(response.data));
      toast.dismiss(loadingToast);
      toast.success(`Welcome ${result.user.displayName}! 🎉`);
      onClose();
      window.location.reload();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Auth error:", error);
      toast.error("Authentication failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90'
        >
          <motion.div 
            initial={{ scale: 0.88, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className='relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-transparent'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-[0_30px_120px_rgb(0,0,0,0.8)] overflow-hidden'>
              <motion.div 
                animate={{ opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 6, repeat: Infinity }}
                className='absolute -top-32 -left-32 w-80 h-80 bg-purple-500/30 blur-[140px]'
              />
              <motion.div 
                animate={{ opacity: [0.25, 0.35, 0.2] }}
                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                className='absolute -top-32 -right-32 w-80 h-80 bg-blue-500/30 blur-[140px]'
              />
              <button 
                onClick={onClose}
                className='absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition text-lg'
              >
                ✕
              </button>

              <div className='relative px-8 pt-14 pb-10 text-center'>
                <h1 className='inline-block mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300'>
                  AI-Powered Website Builder
                </h1>
                <h2 className='text-3xl font-semibold leading-tight mb-3'>
                  <span>Welcome to </span>
                  <span className='bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>
                    Buildly
                  </span>
                </h2>
                
                <div>
                  <motion.button 
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleGoogleAuth}
                    className='group mt-4 relative w-full h-13 rounded-xl bg-white text-black font-semibold shadow-xl overflow-hidden flex items-center justify-center gap-2 py-3'
                  >
                    <FcGoogle className='w-6 h-6' />
                    Continue With Google
                  </motion.button>
                </div>

                <div className='flex items-center gap-4 my-10'>
                  <div className='h-px flex-1 bg-white/10'/>
                  <span className='text-xs text-zinc-500 tracking-wide'>Secure Login</span>
                  <div className='h-px flex-1 bg-white/10'/>
                </div>
                
                <p className='text-xs text-zinc-500 leading-relaxed'>
                  By continuing, you agree to our{" "}
                  <span className='underline cursor-pointer hover:text-zinc-300'>
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className='underline cursor-pointer hover:text-zinc-300'>
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;