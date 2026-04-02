import { motion } from "framer-motion";
import { clsx } from "clsx";

const PremiumButton = ({ children, className, variant = "primary", ...props }) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 shadow-[0_14px_35px_rgba(34,211,238,0.35)]",
    secondary:
      "bg-white/10 text-white border border-white/25 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.35)]",
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/70",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default PremiumButton;
