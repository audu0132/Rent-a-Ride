import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

// Internal Components
import { Navbar, SideBar } from "../components/index.jsx";
import AdminHomeMain from "../pages/AdminHomeMain.jsx";
import Bookings from "../components/Bookings.jsx";
import { showSidebarOrNot } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice.jsx";

// Pages
import {
  AllVehicles,
  AllUsers,
  AllVendors,
  Calender,
  ColorPicker,
  Customers,
  Editor,
  VenderVehicleRequests,
} from "../pages";

function AdminDashNew() {
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);
  const dispatch = useDispatch();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-400 overflow-x-hidden">
      {/* ── Mobile Backdrop ── */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(showSidebarOrNot(false))}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{
          x: activeMenu ? 0 : "-100%",
          width: "20rem",
        }}
        transition={{ type: "spring", damping: 28, stiffness: 250 }}
        className="fixed inset-y-0 left-0 z-50 w-80 overflow-hidden bg-slate-900/90 backdrop-blur-3xl border-r border-white/5 shadow-2xl"
      >
        <SideBar />
      </motion.aside>

      {/* ── Main Content ── */}
      <div
        className={`flex min-h-screen w-full flex-col transition-all duration-300 ${
          activeMenu ? "lg:pl-80" : "pl-0"
        }`}
      >
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
          {/* Mobile hamburger lives in Navbar already; this is just its container */}
          <div className="flex items-center gap-3 px-4 py-3 lg:hidden">
            <button
              onClick={() => dispatch(showSidebarOrNot(!activeMenu))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <HiOutlineMenuAlt3 size={20} />
            </button>
            <span className="text-sm font-black uppercase tracking-widest text-white">
              Admin Panel
            </span>
          </div>
          <div className="hidden lg:block">
            <Navbar />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 xl:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key="admin-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<AdminHomeMain />} />
                <Route path="/adminHome" element={<AdminHomeMain />} />
                <Route path="/allProduct" element={<AllVehicles />} />
                <Route path="/allUsers" element={<AllUsers />} />
                <Route path="/allVendors" element={<AllVendors />} />
                <Route path="/calender" element={<Calender />} />
                <Route path="/colorPicker" element={<ColorPicker />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/vendorVehicleRequests" element={<VenderVehicleRequests />} />
                <Route path="/orders" element={<Bookings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Decorative glows */}
      <div className="pointer-events-none fixed -top-20 -right-20 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-20 -left-20 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
    </div>
  );
}

export default AdminDashNew;
