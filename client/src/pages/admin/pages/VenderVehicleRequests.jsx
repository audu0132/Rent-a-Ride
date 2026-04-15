import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiCheck, HiXMark, HiOutlineIdentification, HiOutlineCheckBadge, HiOutlineClock } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";

// Redux
import { setUpdateRequestTable, setVenodrVehilces, setadminVenodrRequest } from "../../../redux/vendor/vendorDashboardSlice";

const VenderVehicleRequests = () => {
  const { adminVenodrRequest } = useSelector((state) => state.vendorDashboardSlice);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchVendorRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/fetchVendorVehilceRequests`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        dispatch(setVenodrVehilces(data));
        dispatch(setadminVenodrRequest(data));
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorRequests();
  }, []);

  const handleApproveRequest = async (id) => {
    try {
      dispatch(setUpdateRequestTable(id));
      const res = await fetch("/api/admin/approveVendorVehicleRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.ok) {
        toast.success("Request approved successfully");
        fetchVendorRequests();
      }
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      dispatch(setUpdateRequestTable(id));
      const res = await fetch("/api/admin/rejectVendorVehicleRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.ok) {
        toast.error("Request rejected");
        fetchVendorRequests();
      }
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  if (loading) return (
    <div className="flex h-96 w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-8">
      <Toaster position="bottom-center" />
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-emerald-500">
          <HiOutlineIdentification size={32} />
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Fleet Approval Terminal</h1>
        </div>
        <p className="mt-1 text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-11">
          Review and authorize new vehicle submissions from verified vendors
        </p>
      </div>

      <div className="data-table-container">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle Submission</th>
                <th>Registration</th>
                <th>Company</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {adminVenodrRequest && adminVenodrRequest.length > 0 ? (
                  adminVenodrRequest
                    .filter((v) => v.isDeleted === "false")
                    .map((vehicle, idx) => (
                      <motion.tr
                        key={vehicle._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-16 overflow-hidden rounded-xl bg-white/5 border border-white/10">
                              <img 
                                src={vehicle.image[0]} 
                                alt={vehicle.name}
                                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                              />
                            </div>
                            <div>
                              <p className="font-black text-white uppercase tracking-tight">{vehicle.name}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                Request ID: {vehicle._id.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="rounded-lg bg-white/5 border border-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                            {vehicle.registeration_number}
                          </span>
                        </td>
                        <td>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                            {vehicle.company}
                          </p>
                        </td>
                        <td>
                          {vehicle.isRejected ? (
                             <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
                                <HiXMark size={14} />
                                Rejected
                             </span>
                          ) : !vehicle.isAdminApproved ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-500">
                                <HiOutlineClock size={14} />
                                Pending Review
                             </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                <HiOutlineCheckBadge size={14} />
                                Authorized
                             </span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                              whileTap={{ scale: 0.9 }}
                              disabled={vehicle.isAdminApproved || vehicle.isRejected}
                              onClick={() => handleApproveRequest(vehicle._id)}
                              className={`flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-500 transition-all ${
                                (vehicle.isAdminApproved || vehicle.isRejected) ? "opacity-20 cursor-not-allowed" : "bg-emerald-500/10"
                              }`}
                            >
                              <HiCheck size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(244, 63, 94, 0.2)" }}
                              whileTap={{ scale: 0.9 }}
                              disabled={vehicle.isAdminApproved || vehicle.isRejected}
                              onClick={() => handleReject(vehicle._id)}
                              className={`flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 text-rose-500 transition-all ${
                                (vehicle.isAdminApproved || vehicle.isRejected) ? "opacity-20 cursor-not-allowed" : "bg-rose-500/10"
                              }`}
                            >
                              <HiX size={18} />
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
                          <HiOutlineIdentification size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No pending queue for authorization</p>
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

export default VenderVehicleRequests;
