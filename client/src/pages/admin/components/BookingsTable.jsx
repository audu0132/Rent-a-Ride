import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCalendar, HiOutlineStatusOnline } from "react-icons/hi";

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/allBookings", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data) setBookings(data);
    } catch (error) {
      console.error("Fetch bookings failed:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusOptions = [
    "notBooked", "booked", "onTrip", "notPicked", "canceled", "overDue", "tripCompleted"
  ];

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
    <div className="data-table-container">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Route Details</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {bookings.map((booking, idx) => (
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
                        <p className="font-black text-white">{booking.vehicleDetails.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          ID: {booking._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {booking.pickUpLocation}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {booking.dropOffLocation}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-400">
                        {new Date(booking.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 
                        <span className="mx-1 opacity-30">→</span>
                        {new Date(booking.dropOffDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center gap-1.5 rounded-full bg-${getStatusColor(booking.status)}-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-${getStatusColor(booking.status)}-500`}>
                      <HiOutlineStatusOnline size={12} />
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(e, booking._id)}
                      className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-emerald-500/30 hover:text-emerald-500 focus:outline-none"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
