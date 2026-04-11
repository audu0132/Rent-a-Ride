import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCalendar, HiOutlineMapPin, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineInformationCircle } from "react-icons/hi2";

// Components
import UserOrderDetailsModal from "../../components/UserOrderDetailsModal";

// Redux
import {
  setIsOrderModalOpen,
  setSingleOrderDetails,
} from "../../redux/user/userSlice";

export default function Orders() {
  const { currentUser } = useSelector((state) => state.user);
  const { _id } = currentUser || {};

  const [bookings, setBookings] = useState("");
  const dispatch = useDispatch();

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/user/findBookingsOfUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: _id }),
      });

      const data = await res.json();
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDetailsModal = (bookingDetails, vehicleDetails) => {
    dispatch(setIsOrderModalOpen(true));
    dispatch(setSingleOrderDetails(bookingDetails, vehicleDetails));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      <UserOrderDetailsModal />
      
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="font-heading text-4xl font-black text-white">Booking History</h1>
        <p className="mt-2 text-slate-500 font-semibold uppercase tracking-widest text-xs">
          {bookings && bookings.length > 0 
            ? `Manage your ${bookings.length} reservations` 
            : "Your elite journey starts here"}
        </p>
      </div>

      {/* Bookings List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {bookings && bookings.length > 0 ? (
          bookings.map((cur, idx) => {
            const pickupDate = new Date(cur.bookingDetails.pickupDate);
            const dropoffDate = new Date(cur.bookingDetails.dropOffDate);

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 p-1 backdrop-blur-md transition-all hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5"
              >
                <div className="flex flex-col md:flex-row gap-8 rounded-[1.8rem] bg-slate-950/20 p-6 sm:p-8">
                  {/* Vehicle Visual */}
                  <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl md:h-auto md:w-64">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                    <img
                      src={cur.vehicleDetails.image[0]}
                      alt={cur.vehicleDetails.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-3 left-3 z-20">
                       <span className="rounded-lg bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">
                          Confirmed
                       </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                            {cur.vehicleDetails.name}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mt-1">
                            Ref: {cur.bookingDetails._id?.slice(-8)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 rounded-xl bg-white/5 px-4 py-2 border border-white/5 text-emerald-500">
                          <HiOutlineCurrencyRupee size={18} />
                          <span className="text-lg font-black">{cur.bookingDetails.totalPrice}</span>
                        </div>
                      </div>

                      {/* Journey Info */}
                      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {/* Pickup */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                             <div className="h-1 w-1 rounded-full bg-emerald-500" />
                             Pickup details
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                               <HiOutlineMapPin className="text-emerald-500" />
                              <span className="capitalize">{cur.bookingDetails.pickUpLocation}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                              <HiOutlineCalendar className="text-slate-600" />
                              <span>{pickupDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span className="h-4 w-px bg-white/10" />
                              <HiOutlineClock className="text-slate-600" />
                              <span>{pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Drop-off */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                             <div className="h-1 w-1 rounded-full bg-blue-500" />
                             Drop-off details
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                              <HiOutlineMapPin className="text-blue-500" />
                              <span className="capitalize">{cur.bookingDetails.dropOffLocation}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                              <HiOutlineCalendar className="text-slate-600" />
                              <span>{dropoffDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span className="h-4 w-px bg-white/10" />
                              <HiOutlineClock className="text-slate-600" />
                              <span>{dropoffDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDetailsModal(cur)}
                        className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-emerald-500 transition-all hover:bg-emerald-500 hover:text-white"
                      >
                        <HiOutlineInformationCircle size={16} />
                        View Full Details
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 bg-slate-900/20">
             <div className="mb-4 rounded-full bg-slate-900 p-6 text-slate-700">
                <HiOutlineCalendar size={48} />
             </div>
             <h3 className="text-xl font-bold text-white">No active bookings</h3>
             <p className="mt-2 text-slate-500">Your future drives will appear here once booked.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
