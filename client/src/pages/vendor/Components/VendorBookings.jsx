import VendorBookingsTable from "./VendorBookingTable";
import { motion } from "framer-motion";
import { HiOutlineDocumentSearch } from "react-icons/hi";

const VendorBookings = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <HiOutlineDocumentSearch size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Reservation Terminal</h1>
          </div>
          <p className="mt-2 text-slate-500 font-bold uppercase tracking-widest text-xs ml-13">
            Monitor and update status for your assigned fleet
          </p>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <VendorBookingsTable />
      </motion.div>
    </div>
  );
};

export default VendorBookings;