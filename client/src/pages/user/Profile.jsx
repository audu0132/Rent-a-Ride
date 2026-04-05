import { useSelector, useDispatch } from "react-redux";
import { Link, Route, Routes } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowLeft, HiMenuAlt2 } from "react-icons/hi";

// Components
import UserProfileSidebar from "../../components/UserProfileSidebar";
import UserProfileContent from "../../components/UserProfileContent";
import Orders from "./Orders";
import Favorites from "./Favorites";

// Redux
import { showSidebarOrNot } from "../../redux/adminSlices/adminDashboardSlice/DashboardSlice";

function Profile() {
  const { isError } = useSelector((state) => state.user);
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[600px] rounded-full bg-blue-500/5 blur-[150px]" />

      <div className="relative flex min-h-screen">
        {/* Sidebar Container */}
        <AnimatePresence mode="wait">
          {activeMenu ? (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-[1000] h-full w-80 border-r border-white/5 bg-slate-900/40 backdrop-blur-3xl lg:relative lg:bg-transparent"
            >
              <UserProfileSidebar />
            </motion.aside>
          ) : (
            <div className="w-0" />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header / Top Bar */}
          <header className="sticky top-0 z-[900] flex items-center justify-between px-6 py-6 backdrop-blur-md bg-slate-950/20 md:px-12">
            <div className="flex items-center gap-4">
              {!activeMenu && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(showSidebarOrNot(true))}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10"
                >
                  <HiMenuAlt2 size={24} />
                </motion.button>
              )}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Account Dashboard</h2>
                <h1 className="text-2xl font-black font-heading text-white">Owner Portal</h1>
              </div>
            </div>

            <Link
              to="/"
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold transition-all hover:bg-white/10 hover:border-emerald-500/30"
            >
              <HiOutlineArrowLeft className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </header>

          <div className="px-6 py-8 md:px-12 md:py-12">
            {/* Error Message */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-500"
                >
                   {isError.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-6xl"
            >
              <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/30 p-1 backdrop-blur-sm">
                <div className="rounded-[2.2rem] bg-slate-950/20 p-6 sm:p-10">
                  <Routes>
                    <Route path="/" element={<UserProfileContent />} />
                    <Route path="/profiles" element={<UserProfileContent />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/favorites" element={<Favorites />} />
                  </Routes>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
