import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineInformationCircle, HiOutlineCurrencyRupee, HiOutlineStatusOnline } from "react-icons/hi";
import VendorBookingDetailModal from "./VendorBookingModal";
import { setVendorOrderModalOpen, setVendorSingleOrderDetails } from "../../../redux/vendor/vendorBookingSlice";

const VendorBookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [vendorVehicles, setVendorVehicles] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { _id } = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const optionsValue = [
    "notBooked", "booked", "onTrip", "notPicked", "canceled", "overDue", "tripCompleted"
  ];

  const fetchData = async () => {
    try {
      const res = await fetch("/api/vendor/showVendorVehilces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      if (res.ok) {
        const data = await res.json();
        setVendorVehicles(data || []);
      }
    } catch (error) {
      console.error("Vendor vehicles fetch failed:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/allBookings", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data) setBookings(data);
    } catch (error) {
      console.error("Bookings fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (vendorVehicles.length > 0 && bookings.length > 0) {
      const availableVehicleIds = vendorVehicles.map((v) => v._id);
      const filtered = bookings.filter((b) => availableVehicleIds.includes(b.vehicleId));
      setFilteredBookings(filtered);
    }
  }, [vendorVehicles, bookings]);

  const handleStatusChange = async (e, bookingId) => {
    const newStatus = e.target.value;
    try {
      const res = await fetch("/api/admin/changeStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      if (res.ok) fetchBookings();
    } catch (error) {
      console.error("Status change failed:", error);
    }
  };

  const handleDetailsModal = (cur) => {
    dispatch(setVendorOrderModalOpen(true));
    dispatch(setVendorSingleOrderDetails(cur));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked": return "emerald";
      case "onTrip": return "blue";
      case "canceled": return "rose";
      case "overDue": return "amber";
      default: return "slate";
    }
  };

  if (loading) return (
    <div className="flex h-64 w-full items-center justify-center dashboard-card">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-6">
      <VendorBookingDetailModal />
      
      <div className="data-table-container">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Revenue</th>
                <th>Timeline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, idx) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="min-w-[200px]">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-16 overflow-hidden rounded-lg bg-white/5 border border-white/10">
                            <img 
                              src={booking.vehicleDetails.image[0]} 
                              alt={booking.vehicleDetails.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-black text-white uppercase tracking-tight">{booking.vehicleDetails.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              ID: {booking._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 font-black text-white">
                          <HiOutlineCurrencyRupee className="text-emerald-500" />
                          {booking.totalPrice}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1 text-xs font-bold text-slate-400">
                          <span>{new Date(booking.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                          <span className="mx-2 opacity-30">→</span>
                          <span>{new Date(booking.dropOffDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 rounded-full bg-${getStatusColor(booking.status)}-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-${getStatusColor(booking.status)}-500`}>
                          <HiOutlineStatusOnline size={12} />
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(e, booking._id)}
                            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-emerald-500/30 hover:text-emerald-500 focus:outline-none"
                          >
                            {optionsValue.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDetailsModal(booking)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30"
                          >
                            <HiOutlineInformationCircle size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                          <HiOutlineInformationCircle size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No reservations assigned</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorBookingTable;
