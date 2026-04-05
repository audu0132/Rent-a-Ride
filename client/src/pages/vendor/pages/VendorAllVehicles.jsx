import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlinePlus, HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";

// Redux
import {
  setVendorDeleteSuccess,
  setVendorEditSuccess,
  setVendorError,
  setVenodrVehilces,
} from "../../../redux/vendor/vendorDashboardSlice";

const VendorAllVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { vendorVehilces, vendorEditSuccess, vendorDeleteSuccess, vendorErrorSuccess } = useSelector(
    (state) => state.vendorDashboardSlice
  );
  const { _id } = useSelector((state) => state.user.currentUser);
  const [loading, setLoading] = useState(true);

  const fetchVendorVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/showVendorVehilces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(setVenodrVehilces(data));
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorVehicles();
  }, [_id, isAddVehicleClicked]);

  const handleEditVehicle = (vehicle_id) => {
    navigate(`/vendorDashboard/vendorEditProductComponent?vehicle_id=${vehicle_id}`);
  };

  const handleDeleteVehicles = (vehicle_id) => {
    navigate(`/vendorDashboard/vendorDeleteVehicleModal?vehicle_id=${vehicle_id}`);
  };

  useEffect(() => {
    if (vendorEditSuccess) {
      toast.success("Update request sent successfully");
      dispatch(setVendorEditSuccess(false));
    }
    if (vendorDeleteSuccess) {
      toast.success("Vehicle deleted successfully");
      dispatch(setVendorDeleteSuccess(false));
    }
    if (vendorErrorSuccess) {
      toast.error("Operation failed");
      dispatch(setVendorError(false));
    }
  }, [vendorEditSuccess, vendorDeleteSuccess, vendorErrorSuccess]);

  const getStatusBadge = (vehicle) => {
    const isRejected = vehicle.isRejected;
    const isApproved = vehicle.isAdminApproved;

    if (isRejected) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
          <HiXCircle size={14} />
          Rejected
        </span>
      );
    } else if (!isApproved) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-500">
          <HiClock size={14} />
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
          <HiCheckCircle size={14} />
          Approved
        </span>
      );
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">My Fleet</h1>
          <p className="mt-1 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            Manage your submissions and track approval status
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/vendorDashboard/vendorAddProduct")}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
        >
          <HiOutlinePlus size={18} />
          Add Vehicle
        </motion.button>
      </div>

      <div className="data-table-container">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Registration</th>
                <th>Manufacturer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {vendorVehilces && vendorVehilces.length > 0 ? (
                  vendorVehilces
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
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-black text-white uppercase tracking-tight">{vehicle.name}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                ID: {vehicle._id.slice(-6)}
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
                        <td>{getStatusBadge(vehicle)}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#10b981" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditVehicle(vehicle._id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all"
                            >
                              <HiOutlinePencilAlt size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#f43f5e" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteVehicles(vehicle._id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all"
                            >
                              <HiOutlineTrash size={18} />
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
                          <HiOutlinePlus size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No vehicles found in your fleet</p>
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

export default VendorAllVehicles;
