import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-slate-950 overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
      
      <div className="relative flex w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Layout;
