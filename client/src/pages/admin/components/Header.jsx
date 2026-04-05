import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { navLinks } from "../../../constants";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05, 
      color: "#10b981", // Emerald 500
      transition: { type: "spring", stiffness: 400 }
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 px-6 lg:px-20 py-4 ${
        scrolled ? "bg-slate-950/80 backdrop-blur-md border-b border-emerald-500/10 shadow-2xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold font-heading">
              Rent<span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">a</span>Ride
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.li key={link.path} whileHover="hover">
                <Link
                  to={link.path}
                  className={`relative text-sm font-medium tracking-wide transition-colors ${
                    location.pathname === link.path ? "text-emerald-500" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.title}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-full h-[2px] bg-emerald-500 rounded-full"
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* User Actions */}
          <div className="flex items-center space-x-6 border-l border-slate-700/50 pl-8">
            {currentUser ? (
              <Link to="/profile" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    src={currentUser.profilePicture}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover border-2 border-slate-800 group-hover:border-emerald-500 transition-all"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                </div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-1 max-w-[120px]">
                  {currentUser.username}
                </span>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/signin" 
                  className="text-sm font-medium text-slate-300 hover:text-emerald-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all border border-emerald-400/20"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"
          >
            {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 h-screen w-screen bg-slate-950/95 backdrop-blur-xl z-[900] lg:hidden flex flex-col p-10 pt-24"
          >
            <ul className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <motion.li 
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setIsOpen(false)}
                >
                  <Link
                    to={link.path}
                    className="text-3xl font-bold text-slate-100 font-heading active:text-emerald-500"
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto pt-10 border-t border-slate-800">
              {currentUser ? (
                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all"
                >
                  <img
                    src={currentUser.profilePicture}
                    alt="Profile"
                    className="h-14 w-14 rounded-full object-cover shadow-xl shadowed-emerald-500/20"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white leading-tight">{currentUser.username}</span>
                    <span className="text-sm text-emerald-500 font-medium">View Profile</span>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link to="/signin" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-4 text-lg font-bold text-slate-200 hover:text-emerald-500 transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-4 bg-emerald-600 rounded-2xl text-lg font-bold text-white shadow-xl shadow-emerald-900/30">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
