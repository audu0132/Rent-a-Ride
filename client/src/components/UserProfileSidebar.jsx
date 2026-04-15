import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} from "../redux/user/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineUserCircle, HiOutlineLogout, HiOutlineTrash, HiX } from "react-icons/hi";
import { SiShopware } from "react-icons/si";
import { links } from "./UserSidebarContent";
import { showSidebarOrNot } from "../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import API_BASE_URL from "../config/api";

const UserProfileSidebar = () => {
  const { activeMenu, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );

  const { currentUser, isLoading } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      // Use the existing signOut action which cleared the state in your legacy code
      dispatch(signOut());
      navigate("/signin");
    } catch (error) {
      console.error("Signout error", error);
    }
  };

  const handleDelete = async () => {
    if (!currentUser?._id) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${API_BASE_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.succes === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/signin");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      {/* Sidebar Header */}
      <div className="mb-12 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-black">
            R
          </div>
          <span className="text-xl font-black tracking-tighter text-white font-heading">
            Rent<span className="text-emerald-500">a</span>Ride
          </span>
        </Link>
        
        <button
          onClick={() => dispatch(showSidebarOrNot(false))}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-white/10 hover:text-white lg:hidden"
        >
          <HiX size={20} />
        </button>
      </div>

      {/* User Profile Summary */}
      <div className="mb-10 flex items-center gap-4 border-b border-white/5 pb-10">
        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          <img 
            src={currentUser?.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} 
            alt="Profile" 
            className="h-full w-full object-cover" 
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="truncate text-sm font-bold text-white">{currentUser?.username || "Luxury Member"}</h4>
          <p className="truncate text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
            {currentUser?.email?.split('@')[0] || "Standard Tier"}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-2"
      >
        {links.map((section, sIdx) => (
          <div key={sIdx} className="mb-8">
            <h5 className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              {section.title || "Dashboard"}
            </h5>
            <div className="space-y-1">
              {section.links.map((link) => (
                <NavLink
                  key={link.name}
                  to={`/profile/${link.name}`}
                  onClick={() => {
                    if (screenSize <= 900) dispatch(showSidebarOrNot(false));
                  }}
                  className={({ isActive }) => `
                    group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all
                    ${isActive 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span className="text-lg opacity-70 group-hover:scale-110 transition-transform">{link.icon}</span>
                      <span className="capitalize tracking-tight">{link.name}</span>
                      {/* Active Indicator Glimmer */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </motion.nav>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
        <motion.button
          whileHover={{ x: 5 }}
          onClick={handleSignout}
          className="flex w-full items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500 transition-colors hover:text-rose-400"
        >
          <HiOutlineLogout size={20} className="opacity-70" />
          <span className="uppercase tracking-widest text-[11px] font-black">Sign Out</span>
        </motion.button>
        
        <motion.button
          whileHover={{ x: 5 }}
          onClick={handleDelete}
          disabled={isLoading}
          className="flex w-full items-center gap-4 px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:text-rose-600 disabled:opacity-50"
        >
          <HiOutlineTrash size={20} className="opacity-70" />
          <span className="uppercase tracking-widest text-[11px] font-black">{isLoading ? "Deleting..." : "Delete Account"}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default UserProfileSidebar;
