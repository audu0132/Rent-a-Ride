import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";

// Redux
import { setEditData } from "../../../redux/adminSlices/actions";
import { showVehicles } from "../../../redux/user/listAllVehicleSlice";
import { clearAdminVehicleToast } from "../../../redux/adminSlices/adminDashboardSlice/StatusSlice";

const AllVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const [allVehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { adminEditVehicleSuccess, adminAddVehicleSuccess, adminCrudError } =
    useSelector((state) => state.statusSlice);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/showVehicles", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
        dispatch(showVehicles(data));
      }
    } catch (error) {
      console.error("Fetch vehicles failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [isAddVehicleClicked]);

  const handleDelete = async (vehicle_id) => {
    try {
      const res = await fetch(`/api/admin/deleteVehicle/${vehicle_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVehicles(allVehicles.filter((cur) => cur._id !== vehicle_id));
        toast.success("Vehicle deleted successfully");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEditVehicle = (vehicle_id) => {
    dispatch(setEditData({ _id: vehicle_id }));
    navigate(`/adminDashboard/editProducts?vehicle_id=${vehicle_id}`);
  };

  useEffect(() => {
    if (adminEditVehicleSuccess || adminAddVehicleSuccess) {
      toast.success("Operation successful");
      fetchVehicles();
    } else if (adminCrudError) {
      toast.error("Operation failed");
    }
  }, [adminEditVehicleSuccess, adminAddVehicleSuccess, adminCrudError]);

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
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Fleet Inventory</h1>
          <p className="mt-1 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            Manage and monitor your full fleet of {allVehicles.length} vehicles
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/adminDashboard/addProducts")}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
        >
          <HiOutlinePlus size={18} />
          Add New Vehicle
        </motion.button>
      </div>

      {/* Grid View for Mobile / Tablet */}
      <div className="data-table-container">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle Details</th>
                <th>Registration</th>
                <th>Manufacturer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {allVehicles
                  .filter((v) => v.isDeleted === "false" && v.isAdminApproved)
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
                              className="h-full w-full object-cover transition-transform hover:scale-110"
                            />
                          </div>
                          <div>
                            <p className="font-black text-white uppercase tracking-tight">{vehicle.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                          {vehicle.company}
                        </p>
                      </td>
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
                            onClick={() => handleDelete(vehicle._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all"
                          >
                            <HiOutlineTrash size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllVehicles;
