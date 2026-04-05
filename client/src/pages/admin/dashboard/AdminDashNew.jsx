import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// Internal Components
import { Navbar, SideBar } from "../components/index.jsx";
import AdminHomeMain from "../pages/AdminHomeMain.jsx";
import Bookings from "../components/Bookings.jsx";

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

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ 
          width: activeMenu ? "20rem" : "0",
          opacity: activeMenu ? 1 : 0 
        }}
        className="fixed inset-y-0 left-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-3xl shadow-2xl transition-all"
      >
        <SideBar />
      </motion.aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          activeMenu ? "ml-80" : "ml-0"
        }`}
      >
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
          <Navbar />
        </div>

        {/* Dynamic Route Content */}
        <div className="p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
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
        </div>
      </main>

      {/* Decorative Background Glows */}
      <div className="fixed -top-20 -right-20 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="fixed -bottom-20 -left-20 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
    </div>
  );
}

export default AdminDashNew;
