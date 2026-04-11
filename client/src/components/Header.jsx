import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdMenuOpen } from "react-icons/md";
import { navLinks } from "../constants";
import styles from "../index";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState(false);

  // Logic to determine what to show based on auth state
  const isRegularUser = currentUser && !currentUser.isAdmin && !currentUser.isVendor;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        
        {/* LOGO SECTION */}
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20"
          >
            <span className="text-lg font-black text-black">R</span>
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white sm:text-2xl">
              Rent<span className="text-emerald-400">a</span>Ride
            </h1>
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold leading-none mt-0.5">
              Premium
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((navlink, index) => (
            <NavLink
              key={index}
              to={navlink.path}
              className={({ isActive }) =>
                `relative px-5 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                  isActive ? "text-emerald-400" : "text-slate-300 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {navlink.title}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-5 right-5 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            {!isRegularUser && (
              <Link to="/signin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white/20"
                >
                  Sign In
                </motion.button>
              </Link>
            )}

            {isRegularUser ? (
              <Link to="/profile">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-emerald-500/10 shadow-lg"
                >
                  <img
                    src={currentUser.profilePicture}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover border-2 border-slate-950 transition-transform group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            ) : (
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40"
                >
                  Get Started
                </motion.button>
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setNav(!nav)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
          >
            {nav ? (
              <MdMenuOpen className="text-2xl" />
            ) : (
              <RxHamburgerMenu className="text-2xl" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* MOBILE DRAWER (Framer Motion) */}
      <AnimatePresence>
        {nav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNav(false)}
              className="fixed inset-0 top-[73px] z-[49] bg-slate-950/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 top-[73px] z-50 w-full max-w-[300px] border-l border-white/10 bg-[#070b1d] p-8 shadow-2xl lg:hidden"
            >
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Navigation</span>
                {navLinks.map((navlink, index) => (
                  <NavLink
                    key={index}
                    to={navlink.path}
                    onClick={() => setNav(false)}
                    className={({ isActive }) =>
                      `text-xl font-bold transition-all ${
                        isActive ? "text-emerald-400" : "text-white hover:text-emerald-400"
                      }`
                    }
                  >
                    {navlink.title}
                  </NavLink>
                ))}

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                  {isRegularUser ? (
                    <Link to="/profile" onClick={() => setNav(false)} className="flex items-center gap-4">
                      <img src={currentUser.profilePicture} className="h-12 w-12 rounded-full border-2 border-emerald-500" />
                      <div>
                        <p className="text-white font-bold">Profile</p>
                        <p className="text-xs text-slate-500">View your dashboard</p>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <Link to="/signin" onClick={() => setNav(false)}>
                        <button className="w-full rounded-xl border border-white/10 bg-white/5 py-4 text-sm font-black uppercase tracking-widest text-white">
                          Sign In
                        </button>
                      </Link>
                      <Link to="/signup" onClick={() => setNav(false)}>
                        <button className="w-full rounded-xl bg-emerald-500 py-4 text-sm font-black uppercase tracking-widest text-slate-950">
                          Sign Up
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
