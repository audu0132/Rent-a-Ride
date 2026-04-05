import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiOutlineLogout } from "react-icons/hi";
import { SiShopware } from "react-icons/si";

// Redux
import { signOut } from "../../../redux/user/userSlice.jsx";
import { showSidebarOrNot } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice.jsx";

// Data
import { links } from '../data/vendorSidebarContents.jsx';

const VendorSidebar = () => {
  const { activeMenu, screenSize } = useSelector((state) => state.adminDashboardSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/admin/signout", { method: "GET" });
      if (res.ok) {
        dispatch(signOut());
        navigate("/signin");
      }
    } catch (error) {
      console.error("Signout failed:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-900/60 backdrop-blur-3xl border-r border-white/5 p-6 dashboard-scrollbar overflow-y-auto">
      {/* Sidebar Header */}
      <div className="mb-12 flex items-center justify-between">
        <Link
          to="/vendorDashboard"
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <SiShopware size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-white font-heading">
            Vendor Portal
          </span>
        </Link>
        <button
          onClick={() => dispatch(showSidebarOrNot(false))}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-white/10 hover:text-white md:hidden"
        >
          <HiX size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-8"
      >
        {links.map((item) => (
          <div key={item.title}>
            <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              {item.title}
            </p>
            <div className="space-y-1">
              {item.links.map((link) => (
                <NavLink
                  to={`/vendorDashboard/${link.name}`}
                  key={link.name}
                  onClick={() => {
                    if (screenSize <= 900) dispatch(showSidebarOrNot(false));
                  }}
                  className={({ isActive }) => `
                    group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all
                    ${isActive 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }
                  `}
                >
                  <motion.span 
                    variants={itemVariants}
                    className="text-lg opacity-70 group-hover:scale-110 transition-transform"
                  >
                    {link.icon}
                  </motion.span>
                  <span className="capitalize">{link.name}</span>
                  {/* Active Indicator */}
                  {({ isActive }) => isActive && (
                    <motion.div 
                      layoutId="activeIndicatorVendor"
                      className="ml-auto h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    />
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </motion.nav>

      {/* Logout Action */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <motion.button
          whileHover={{ x: 5 }}
          onClick={handleSignout}
          className="flex w-full items-center gap-4 px-4 py-3 text-sm font-bold text-slate-400 transition-colors hover:text-rose-400"
        >
          <HiOutlineLogout size={20} className="opacity-70" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
};

export default VendorSidebar;