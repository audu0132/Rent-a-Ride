import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiOutlineCloudUpload, HiOutlineSave, HiOutlineExclamationCircle } from "react-icons/hi";
import { setLoading, setadminEditVehicleSuccess, setadminCrudError } from "../../../redux/adminSlices/adminDashboardSlice/StatusSlice";
import API_BASE_URL from "../../../config/api";

const EditProductComponent = () => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicle_id = queryParams.get("vehicle_id");

  const { modelData, companyData, locationData, districtData } = useSelector((state) => state.modelDataSlice);
  const { loading } = useSelector(state => state.statusSlice);
  const [vehicleData, setVehicleData] = useState(null);

  // Fetch individual vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/getVehicle/${vehicle_id}`);
        if (res.ok) {
          const data = await res.json();
          setVehicleData(data);
          reset(data); // Pre-fill the form
        }
      } catch (err) {
        console.error("Fetch vehicle failed:", err);
      }
    };
    if (vehicle_id) fetchVehicle();
  }, [vehicle_id, reset]);

  const onSubmit = async (editData) => {
    try {
      const formData = new FormData();
      formData.append("id", vehicle_id);
      formData.append("registeration_number", editData.registeration_number);
      formData.append("company", editData.company);
      formData.append("name", editData.name);
      formData.append("model", editData.model);
      formData.append("title", editData.title);
      formData.append("base_package", editData.base_package);
      formData.append("price", editData.price);
      formData.append("description", editData.description);
      formData.append("year_made", editData.year_made);
      formData.append("fuel_type", editData.fuel_type);
      formData.append("seat", editData.seat);
      formData.append("transmition_type", editData.transmition_type);
      formData.append("insurance_end_date", editData.insurance_end_date);
      formData.append("registeration_end_date", editData.registeration_end_date);
      formData.append("polution_end_date", editData.polution_end_date);
      formData.append("car_type", editData.car_type);
      formData.append("location", editData.location);
      formData.append("district", editData.district);

      if (editData.image && editData.image.length > 0) {
        for (let i = 0; i < editData.image.length; i++) {
          formData.append("image", editData.image[i]);
        }
      }

      dispatch(setLoading(true));
      const toastId = toast.loading("Saving changes...", { position: "bottom-center" });

      const res = await fetch(`${API_BASE_URL}/api/admin/editProduct`, {
        method: "PUT",
        body: formData
      });

      if (res.ok) {
        dispatch(setadminEditVehicleSuccess(true));
        toast.success("Vehicle updated successfully!", { id: toastId });
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error("Failed to update vehicle", { id: toastId });
      }
    } catch (error) {
      dispatch(setadminCrudError(true));
      console.error(error);
      toast.error("An error occurred");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const InputWrapper = ({ label, children, error }) => (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
        {label}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 ml-1">
          <HiOutlineExclamationCircle /> {error.message || "Required field"}
        </span>
      )}
    </div>
  );

  const inputClasses = "w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-semibold text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-white/10 placeholder:text-slate-600";
  const selectClasses = "w-full rounded-2xl border border-white/5 bg-slate-900 px-5 py-4 text-sm font-semibold text-white outline-none transition-all focus:border-emerald-500/50 appearance-none cursor-pointer";

  if (!vehicleData) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
      <Toaster position="bottom-center" />
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => navigate(-1)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      {/* Side Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative h-full w-full max-w-2xl bg-slate-900 shadow-2xl overflow-y-auto border-l border-white/5"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-slate-900/80 p-8 backdrop-blur-md">
          <div className="flex items-center gap-6">
             <div className="h-16 w-20 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <img src={vehicleData?.image?.[0]} className="h-full w-full object-cover" alt="vehicle" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Update Configuration</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Refining {vehicleData?.name}</p>
             </div>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            <HiOutlineX size={24} />
          </motion.button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
          
          {/* Section: Basic Info */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">01. Identity & Brand</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Registration ID" error={errors.registeration_number}>
                <input {...register("registeration_number", { required: true })} className={inputClasses} />
              </InputWrapper>
              
              <InputWrapper label="Manufacturer" error={errors.company}>
                <select {...register("company", { required: true })} className={selectClasses}>
                  {companyData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper label="Model Name" error={errors.name}>
                <input {...register("name", { required: true })} className={inputClasses} />
              </InputWrapper>

              <InputWrapper label="Model Year" error={errors.model}>
                <select {...register("model", { required: true })} className={selectClasses}>
                  {modelData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>
            </div>
          </div>

          {/* Pricing & Description */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">02. Fleet Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Daily Rate (₹)" error={errors.price}>
                <input type="number" {...register("price", { required: true })} className={inputClasses} />
              </InputWrapper>
              <InputWrapper label="Fuel Economy / Package" error={errors.base_package}>
                <input {...register("base_package")} className={inputClasses} />
              </InputWrapper>
            </div>
            <InputWrapper label="Deployment Strategy" error={errors.description}>
              <textarea {...register("description")} rows={4} className={`${inputClasses} resize-none`} />
            </InputWrapper>
          </div>

          {/* Performance Specs */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">03. Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWrapper label="Fuel System">
                <select {...register("fuel_type")} className={selectClasses}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electirc">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </InputWrapper>
              <InputWrapper label="Transmission">
                <select {...register("transmition_type")} className={selectClasses}>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </InputWrapper>
              <InputWrapper label="Capacities (Seats)">
                <select {...register("seat")} className={selectClasses}>
                  <option value="5">5 Seats</option>
                  <option value="7">7 Seats</option>
                  <option value="8">8 Seats</option>
                </select>
              </InputWrapper>
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">04. Operational Region</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Deployment Hub">
                <select {...register("location")} className={selectClasses}>
                  {locationData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>
              <InputWrapper label="District Tier">
                <select {...register("district")} className={selectClasses}>
                  {districtData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>
            </div>
          </div>

          {/* Regulation */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">05. Compliance Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWrapper label="Insurance Renewal">
                <input type="date" {...register("insurance_end_date")} className={inputClasses} />
              </InputWrapper>
              <InputWrapper label="FC Validity">
                <input type="date" {...register("registeration_end_date")} className={inputClasses} />
              </InputWrapper>
              <InputWrapper label="Pollution Check">
                <input type="date" {...register("polution_end_date")} className={inputClasses} />
              </InputWrapper>
            </div>
          </div>

          {/* Section: Visual Assets */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">06. Gallery Update</h3>
            <div className="relative group">
              <input type="file" multiple {...register("image")} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-12 transition-all group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5">
                <div className="h-16 w-16 mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <HiOutlineCloudUpload size={32} />
                </div>
                <p className="text-sm font-bold text-slate-300">Update automotive visuals or <span className="text-emerald-500">browse</span></p>
                <p className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-widest text-center italic">Optional: Uploading new images will replace existing gallery</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 pt-8 pb-10 flex gap-4 bg-slate-900 border-t border-white/5 mt-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-emerald-500 py-5 text-sm font-black uppercase tracking-[0.2em] text-slate-950 shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-50"
            >
              Update Fleet Metrics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 rounded-2xl bg-white/5 text-sm font-black uppercase tracking-[0.2em] text-slate-300 border border-white/5 hover:bg-white/10 transition-all"
            >
              Discard Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductComponent;
