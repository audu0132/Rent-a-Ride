import Header from "../Header";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const WithNav = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,#dff9ff_0%,#f8fafc_35%,#f1f5f9_100%)]" />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default WithNav;
