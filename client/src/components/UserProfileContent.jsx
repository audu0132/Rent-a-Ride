import { useDispatch, useSelector } from "react-redux";
import ProfileEdit from "../pages/user/ProfileEdit";
import toast, { Toaster } from "react-hot-toast";
import { setUpdated } from "../redux/user/userSlice";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineShieldCheck } from "react-icons/hi";

const UserProfileContent = () => {
  const { email, username, profilePicture, phoneNumber, adress } = useSelector(
    (state) => state.user.currentUser
  );
  const dispatch = useDispatch();
  const isUpdated = useSelector((state) => state.user.isUpdated);
  
  useEffect(() => {
    if (isUpdated) {
      toast.success("Profile successfully updated", {
        style: {
          borderRadius: '1rem',
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        },
      });
      dispatch(setUpdated(false));
    }
  }, [isUpdated, dispatch]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Toaster position="top-right" />
      
      <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-md">
        {/* Banner Section */}
        <div className="relative h-48 w-full bg-gradient-to-br from-emerald-600/20 via-slate-900 to-blue-600/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute bottom-4 right-8 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md border border-emerald-500/20">
             <HiOutlineShieldCheck className="text-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Verified Member</span>
          </div>
        </div>

        <div className="px-8 pb-12 sm:px-12">
          {/* Avatar Section */}
          <div className="relative flex items-end justify-between">
            <div className="relative -mt-16 inline-block">
              <div className="h-32 w-32 overflow-hidden rounded-[2rem] border-4 border-slate-950 bg-slate-900 shadow-2xl transition-transform hover:scale-105">
                <img
                  src={profilePicture}
                  alt={username}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 z-20">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-2xl bg-emerald-600 p-1 shadow-lg shadow-emerald-500/20"
                >
                  <ProfileEdit />
                </motion.div>
              </div>
            </div>
            
            <div className="mb-4 hidden sm:block">
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 italic">Member since 2024</span>
            </div>
          </div>

          {/* User Bio */}
          <div className="mt-8 border-b border-white/5 pb-8">
            <motion.h3 variants={itemVariants} className="font-heading text-4xl font-black text-white">
              {username}
            </motion.h3>
            <motion.div variants={itemVariants} className="mt-2 flex items-center gap-2 text-slate-500 font-semibold uppercase tracking-widest text-xs">
              <HiOutlineMail size={14} className="text-emerald-500" />
              {email}
            </motion.div>
          </div>

          {/* Action Info Grid */}
          <div className="mt-10">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-slate-600">
              Identity & Contact
            </h4>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <motion.div 
                variants={itemVariants}
                className="group flex flex-col gap-2 rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-emerald-500 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <HiOutlinePhone size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact Number</span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-200">
                  {phoneNumber || "Add number"}
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="group flex flex-col gap-2 rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-emerald-500 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <HiOutlineLocationMarker size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Living Address</span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-200 truncate">
                  {adress || "Add address"}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Summary Footer */}
      <div className="mt-8 flex justify-between items-center px-4">
         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Account status: <span className="text-emerald-500">Active</span></p>
         <div className="h-1 flex-1 mx-8 rounded-full bg-slate-900/50 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" 
            />
         </div>
         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Level: <span className="text-emerald-500">Elite</span></p>
      </div>
    </motion.div>
  );
};

export default UserProfileContent;
