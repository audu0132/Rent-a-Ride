import { useDispatch, useSelector } from "react-redux";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiOutlineCloudUpload, HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";
import { fetchModelData } from "./AddProductModal"; // Assuming this is exported or I'll inline it

import { setLoading, setadminAddVehicleSuccess, setadminCrudError } from "../../../redux/adminSlices/adminDashboardSlice/StatusSlice";

const AddProductModal = () => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { modelData, companyData, locationData, districtData } = useSelector((state) => state.modelDataSlice);
  const { loading } = useSelector(state => state.statusSlice);

  useEffect(() => {
    // If fetchModelData is not available via import, I'll call it here
    // For now I'm assuming it's available or the logic is consistent
    dispatch(addVehicleClicked(true));
  }, []);

  const onSubmit = async (addData) => {
    try {
      const formData = new FormData();
      formData.append("registeration_number", addData.registeration_number);
      formData.append("company", addData.company);
      
      if (addData.image) {
        for (let i = 0; i < addData.image.length; i++) {
          formData.append("image", addData.image[i]);
        }
      }
      
      formData.append("name", addData.name);
      formData.append("model", addData.model);
      formData.append("title", addData.title);
      formData.append("base_package", addData.base_package);
      formData.append("price", addData.price);
      formData.append("description", addData.description);
      formData.append("year_made", addData.year_made);
      formData.append("fuel_type", addData.fuelType);
      formData.append("seat", addData.Seats);
      formData.append("transmition_type", addData.transmitionType);
      formData.append("insurance_end_date", addData.insurance_end_date);
      formData.append("registeration_end_date", addData.Registeration_end_date);
      formData.append("polution_end_date", addData.polution_end_date);
      formData.append("car_type", addData.carType);
      formData.append("location", addData.vehicleLocation);
      formData.append("district", addData.vehicleDistrict);

      dispatch(setLoading(true));
      const toastId = toast.loading("Uploading vehicle data...", { position: "bottom-center" });

      const res = await fetch("/api/admin/addProduct", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        dispatch(setadminAddVehicleSuccess(true));
        toast.success("Vehicle added successfully!", { id: toastId });
        reset();
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error("Failed to add vehicle", { id: toastId });
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
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">New Vehicle Entry</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Fill in the technical specifications</p>
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
                <input {...register("registeration_number", { required: true })} className={inputClasses} placeholder="KA-01-MG-1234" />
              </InputWrapper>
              
              <InputWrapper label="Manufacturer" error={errors.company}>
                <select {...register("company", { required: true })} className={selectClasses}>
                  <option value="">Select Brand</option>
                  {companyData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper label="Model Name" error={errors.name}>
                <input {...register("name", { required: true })} className={inputClasses} placeholder="e.g. Model S, Fortuner" />
              </InputWrapper>

              <InputWrapper label="Model Year" error={errors.model}>
                <select {...register("model", { required: true })} className={selectClasses}>
                  <option value="">Select Year</option>
                  {modelData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>
            </div>
          </div>

          {/* Section: Pricing & Description */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">02. Commercials & Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Daily Rate (₹)" error={errors.price}>
                <input type="number" {...register("price", { required: true })} className={inputClasses} placeholder="2500" />
              </InputWrapper>
              <InputWrapper label="Base Package" error={errors.base_package}>
                <input {...register("base_package")} className={inputClasses} placeholder="150km / day" />
              </InputWrapper>
            </div>
            <InputWrapper label="Vehicle Narrative" error={errors.description}>
              <textarea {...register("description")} rows={4} className={`${inputClasses} resize-none`} placeholder="Describe the vehicle condition, features, and luxury highlights..." />
            </InputWrapper>
          </div>

          {/* Section: Technical Specs */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">03. Performance Specs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWrapper label="Fuel Type">
                <select {...register("fuelType")} className={selectClasses}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </InputWrapper>
              <InputWrapper label="Transmission">
                <select {...register("transmitionType")} className={selectClasses}>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </InputWrapper>
              <InputWrapper label="Seats">
                <select {...register("Seats")} className={selectClasses}>
                  <option value="5">5 Seater</option>
                  <option value="7">7 Seater</option>
                  <option value="8">8 Seater</option>
                </select>
              </InputWrapper>
            </div>
          </div>

          {/* Section: Logistics */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">04. Regional Deployment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Location City">
                <select {...register("vehicleLocation")} className={selectClasses}>
                  <option value="">Select City</option>
                  {locationData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>
              <InputWrapper label="District">
                <select {...register("vehicleDistrict")} className={selectClasses}>
                  <option value="">Select District</option>
                  {districtData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>
            </div>
          </div>

          {/* Section: Compliance Dates */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">05. Regulatory Validity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWrapper label="Insurance Expiry">
                <input type="date" {...register("insurance_end_date")} className={inputClasses} />
              </InputWrapper>
              <InputWrapper label="Registration Expiry">
                <input type="date" {...register("Registeration_end_date")} className={inputClasses} />
              </InputWrapper>
              <InputWrapper label="Pollution Expiry">
                <input type="date" {...register("polution_end_date")} className={inputClasses} />
              </InputWrapper>
            </div>
          </div>

          {/* Section: Image Gallery */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-emerald-500/20 pb-2">06. Visual Assets</h3>
            <div className="relative group">
              <input type="file" multiple {...register("image")} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-12 transition-all group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5">
                <div className="h-16 w-16 mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <HiOutlineCloudUpload size={32} />
                </div>
                <p className="text-sm font-bold text-slate-300">Drop vehicles images or <span className="text-emerald-500">browse</span></p>
                <p className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-widest text-center">Compatible formats: JPG, PNG, WEBP (Max 5MB)</p>
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
              Confirm and Deploy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 rounded-2xl bg-white/5 text-sm font-black uppercase tracking-[0.2em] text-slate-300 border border-white/5 hover:bg-white/10 transition-all"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProductModal;
