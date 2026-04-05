import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../../../constants";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020817]/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/20"
          >
            <span className="text-lg font-black text-black">R</span>
          </motion.div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-wide text-white">
              Rent<span className="text-green-400">a</span>Ride
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">
              Premium Car Rental
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-lg backdrop-blur-md md:flex">
          {navLinks.map((nav) => (
            <motion.div
              key={nav.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <NavLink
                to={nav.path}
                className={({ isActive }) =>
                  `rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${isActive
                    ? "bg-green-500 text-black shadow-md"
                    : "text-white hover:bg-white/10 hover:text-green-400"
                  }`
                }
              >
                {nav.title}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-3 md:flex">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
          >
            Sign In
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/10 transition-all duration-300 hover:bg-green-500/20"
          >
            <FaUserCircle className="text-2xl" />
          </motion.button>
        </div>

        {/* Mobile button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
          onClick={() => setToggle((prev) => !prev)}
        >
          {toggle ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenuAlt3 className="text-2xl" />
          )}
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 bg-[#071124]/95 px-6 py-5 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((nav) => (
                <motion.div
                  key={nav.id}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink
                    to={nav.path}
                    onClick={() => setToggle(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${isActive
                        ? "bg-green-500 text-black"
                        : "bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    {nav.title}
                  </NavLink>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;