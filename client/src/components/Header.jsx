import { navLinks } from "../constants";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PremiumButton from "./ui/PremiumButton";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-4 z-50 mx-auto w-[95%] max-w-7xl">
      <div className="rounded-2xl border border-white/25 bg-white/70 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop-blur-xl md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-slate-900">
            <Sparkles className="h-5 w-5 text-cyan-500" />
            <span className="text-lg font-bold tracking-tight md:text-xl">Rent a Ride</span>
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-2 rounded-xl bg-slate-900/5 p-1">
              {navLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      pathname === item.path
                        ? "bg-white text-slate-900 shadow"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {currentUser && !currentUser.isAdmin && !currentUser.isVendor ? (
              <Link to="/profile" className="rounded-full ring-2 ring-cyan-300/70">
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </Link>
            ) : (
              <>
                <Link to="/signin">
                  <PremiumButton variant="secondary" className="px-4 py-2 text-xs text-slate-900">
                    Sign In
                  </PremiumButton>
                </Link>
                <Link to="/signup">
                  <PremiumButton className="px-4 py-2 text-xs">Create account</PremiumButton>
                </Link>
              </>
            )}
          </div>

          <button
            className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
            onClick={() => setNav((prev) => !prev)}
            aria-label="Open menu"
          >
            {nav ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {nav && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-2 rounded-2xl border border-white/25 bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setNav(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
                >
                  {item.title}
                </Link>
              ))}
              {!currentUser && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link to="/signin" onClick={() => setNav(false)}>
                    <PremiumButton variant="secondary" className="w-full text-xs">
                      Sign In
                    </PremiumButton>
                  </Link>
                  <Link to="/signup" onClick={() => setNav(false)}>
                    <PremiumButton className="w-full text-xs">Sign Up</PremiumButton>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
