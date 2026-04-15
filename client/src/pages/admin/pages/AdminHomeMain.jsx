import { motion } from "framer-motion";
import { HiOutlineArrowTrendingUp, HiOutlineUsers, HiOutlineViewColumns, HiOutlineClock, HiOutlineCurrencyRupee } from "react-icons/hi2";
import { LineChart } from "../components";

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className="stat-card"
  >
    <div className="flex items-center justify-between">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-${color}-500/10 text-${color}-500 shadow-lg shadow-${color}-500/5`}>
        <Icon size={22} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
          <HiOutlineArrowTrendingUp size={11} />
          {trend}
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl sm:text-3xl font-black text-white tracking-tighter">{value}</h3>
    </div>
    <div className={`absolute -bottom-2 -right-2 h-16 w-16 opacity-5 text-${color}-500`}>
      <Icon size={64} />
    </div>
  </motion.div>
);

const AdminHomeMain = () => {
  const stats = [
    { title: "Total Bookings",     value: "1,284", icon: HiOutlineViewColumns, trend: "+12%",    color: "blue" },
    { title: "Active Bookings",    value: "432",   icon: HiOutlineClock,        trend: "+5%",     color: "emerald" },
    { title: "Total Revenue",      value: "₹6.3M", icon: HiOutlineCurrencyRupee,trend: "+18%",   color: "amber" },
    { title: "Total Vehicles",     value: "85",    icon: HiOutlineViewColumns,                    color: "indigo" },
    { title: "Pending Requests",   value: "12",    icon: HiOutlineUsers,        trend: "Pending", color: "rose" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Overview for the current fiscal period</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-6"
      >
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </motion.div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Revenue Chart – 2/3 width on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="dashboard-card lg:col-span-2"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">Revenue Analytics</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Growth projection for current year</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-[10px] font-black text-slate-300">
              Last 12 Months
            </div>
          </div>
          {/* Fixed-height container prevents the width(-1) height(-1) error */}
          <div className="h-[260px] sm:h-[300px] lg:h-[350px] w-full">
            <LineChart />
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="dashboard-card"
        >
          <h3 className="mb-6 text-base sm:text-lg font-black text-white uppercase tracking-tight">Strategic Actions</h3>
          <div className="space-y-3">
            {[
              { label: "New Vehicle Request", time: "2m ago" },
              { label: "High Revenue Alert",  time: "15m ago" },
              { label: "Booking Overdue",     time: "1h ago" },
              { label: "New User Registered", time: "3h ago" },
            ].map((action, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10 hover:translate-x-1 cursor-pointer"
              >
                <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate">{action.label}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-0.5">{action.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHomeMain;
