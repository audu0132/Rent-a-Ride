import { useDispatch, useSelector } from "react-redux";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineX, 
  HiOutlineCloudUpload, 
  HiOutlineExclamationCircle,
  HiOutlineChevronRight
} from "react-icons/hi";
import useFetchLocationsLov from "../../../hooks/useFetchLocationsLov";
import API_BASE_URL from "../../../config/api";

const VendorAddProductModal = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { modelData, companyData, locationData, districtData } = useSelector((state) => state.modelDataSlice);
  const { _id } = useSelector((state) => state.user.currentUser);
  
  const [loading, setLoading] = useState(false);
  const { fetchLov } = useFetchLocationsLov();

  useEffect(() => {
    dispatch(addVehicleClicked(true));
    fetchLov();
  }, []);

  const handleClose = () => {
    dispatch(addVehicleClicked(false));
    navigate("/vendorDashboard/vendorAllVeihcles");
  };

  const onSubmit = async (addData) => {
    try {
      setLoading(true);
      const toastId = toast.loading("Encrypting and submitting matrix...", { position: "bottom-center" });

      const formData = new FormData();
      formData.append("registeration_number", addData.registeration_number);
      formData.append("company", addData.company);
      
      // Multiple Images
      if (addData.image && addData.image.length > 0) {
        for (let i = 0; i < addData.image.length; i++) {
          formData.append("image", addData.image[i]);
        }
      }

      // Documentation
      if (addData.insurance_image?.[0]) formData.append("insurance_image", addData.insurance_image[0]);
      if (addData.rc_book_image?.[0]) formData.append("rc_book_image", addData.rc_book_image[0]);
      if (addData.polution_image?.[0]) formData.append("polution_image", addData.polution_image[0]);
      
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
      formData.append("addedBy", _id);

      const res = await fetch(`${API_BASE_URL}/api/vendor/vendorAddVehicle`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Listing deployed to orbital admin for approval!", { id: toastId });
        reset();
        setTimeout(() => handleClose(), 1500);
      } else {
        toast.error("Telemetry failed. Overide denied.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Critical failure during transmission.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4 text-sm font-bold text-slate-200 outline-none transition-all focus:border-emerald-500/40 focus:bg-slate-900/60 focus:shadow-[0_0_25px_rgba(16,185,129,0.15)] placeholder:text-slate-600 appearance-none backdrop-blur-sm";
  const selectClasses = "w-full rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4 text-sm font-bold text-slate-200 outline-none transition-all focus:border-emerald-500/40 focus:bg-slate-900/60 focus:shadow-[0_0_25px_rgba(16,185,129,0.15)] appearance-none cursor-pointer hover:bg-slate-900/50 backdrop-blur-sm";

  const InputWrapper = ({ label, children, error, index = 0 }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="flex flex-col gap-2 w-full relative group mb-6"
    >
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 group-focus-within:text-emerald-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-emerald-500/0 blur-md transition-all duration-300 group-focus-within:bg-emerald-500/20" />
        {children}
      </div>
      {error && (
        <span className="absolute -bottom-5 left-2 flex items-center gap-1 text-[9px] font-bold text-rose-500">
          <HiOutlineExclamationCircle size={12} /> {error.message || "Required field"}
        </span>
      )}
    </motion.div>
  );

  const Section = ({ num, title, subtitle, children }) => (
    <div className="relative border-l border-white/5 pl-8 ml-4 pb-12 group">
      {/* Glow Line on Hover */}
      <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:via-emerald-500/50 transition-all duration-700" />
      
      {/* Section Dot */}
      <div className="absolute top-0 -left-[17px] h-8 w-8 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 group-hover:border-emerald-500/30 transition-colors">
        <div className="h-2 w-2 rounded-full bg-emerald-500 opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(16,185,129,1)] transition-all" />
      </div>
      
      <div className="mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-1"
        >
          <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm tracking-[0.2em] border border-emerald-500/20">{num}</span>
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] drop-shadow-lg">{title}</h3>
        </motion.div>
        {subtitle && <p className="text-[10px] font-bold tracking-widest text-slate-500 mt-2">{subtitle}</p>}
      </div>
      {children}
    </div>
  );

  const FileUploadCard = ({ label, subtitle, registerName, required, delay = 0 }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative group w-full mb-6"
    >
      <input type="file" {...register(registerName, { required })} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
      <div className="relative overflow-hidden flex items-center gap-5 border border-white/5 bg-slate-950/40 rounded-2xl p-5 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:border-emerald-500/40 group-hover:bg-emerald-950/20 group-active:scale-[0.98]">
        {/* Hover Background Glow */}
        <div className="absolute -inset-20 bg-emerald-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative h-12 w-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 shrink-0 group-hover:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0)] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <HiOutlineCloudUpload size={24} />
        </div>
        <div className="relative">
          <p className="text-xs font-black text-slate-200 tracking-[0.1em] uppercase">{label}</p>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.15em] mt-1 group-hover:text-emerald-400/70 transition-colors">{subtitle}</p>
        </div>
      </div>
      {errors[registerName] && (
        <span className="absolute -bottom-5 left-2 flex items-center gap-1 text-[9px] font-bold text-rose-500">
          <HiOutlineExclamationCircle size={12} /> Required Segment
        </span>
      )}
    </motion.div>
  );

  if (!isAddVehicleClicked) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-center items-center p-4 sm:p-6 lg:p-10 overflow-hidden">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#020617', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      
      {/* Matte Dark Backdrop with Subtle Grain */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <div className="w-[80vw] h-[80vw] rounded-full bg-emerald-500/10 blur-[150px] opacity-60 mix-blend-screen" />
      </div>

      {/* Cinematic Centered Panel */}
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.8 }}
        className="relative w-full max-w-5xl max-h-full bg-slate-900/90 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-y-auto dashboard-scrollbar rounded-3xl border border-white/5 flex flex-col"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 flex flex-shrink-0 items-center justify-between border-b border-white/5 bg-slate-900/80 p-8 md:px-12 backdrop-blur-xl rounded-t-3xl">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                Vehicle Provisioning
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-5">
                Classify & Deploy Assets to the Grid
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all shadow-lg"
          >
            <HiOutlineX size={20} />
          </motion.button>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 pb-10 flex-1">
          
          <Section num="01" title="Core Identity" subtitle="Primary schematic and manufacturer details.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InputWrapper label="Registration Designation" error={errors.registeration_number} index={1}>
                <input {...register("registeration_number", { required: true })} className={inputClasses} placeholder="SYS-KL-0001" />
              </InputWrapper>
              
              <InputWrapper label="Manufacturer Class" error={errors.company} index={2}>
                <select {...register("company", { required: true })} className={selectClasses}>
                  <option value="">Select Protocol</option>
                  {companyData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper label="Model Classification" error={errors.name} index={3}>
                <input {...register("name", { required: true })} className={inputClasses} placeholder="Type designation" />
              </InputWrapper>

              <InputWrapper label="Production Cycle" error={errors.model} index={4}>
                <select {...register("model", { required: true })} className={selectClasses}>
                  <option value="">Select Cycle</option>
                  {modelData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper label="Internal Reference" error={errors.title} index={5}>
                <input {...register("title")} className={inputClasses} placeholder="Vanguard Series Alpha" />
              </InputWrapper>

              <InputWrapper label="Year of Assembly" error={errors.year_made} index={6}>
                <input type="number" {...register("year_made", { required: true })} className={inputClasses} placeholder="2024" />
              </InputWrapper>
            </div>
          </Section>

          <Section num="02" title="Commercial Metrics" subtitle="Asset valuation and package configurations.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InputWrapper label="Standard Rate (Cr)" error={errors.price} index={1}>
                <input type="number" {...register("price", { required: true })} className={inputClasses} placeholder="0.00" />
              </InputWrapper>
              <InputWrapper label="Base Mileage Limit" error={errors.base_package} index={2}>
                <input {...register("base_package")} className={inputClasses} placeholder="Capacity range" />
              </InputWrapper>
            </div>
            <InputWrapper label="Asset Diagnostics & Details" error={errors.description} index={3}>
              <textarea {...register("description")} rows={4} className={`${inputClasses} resize-none`} placeholder="Elaborate on hardware modifications and premium interior..." />
            </InputWrapper>
          </Section>

          <Section num="03" title="Hardware Specs" subtitle="Drivetrain and interior volume details.">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6">
              <InputWrapper label="Chassis Type" index={1}>
                <select {...register("carType")} className={selectClasses}>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                </select>
              </InputWrapper>
              <InputWrapper label="Power Core" index={2}>
                <select {...register("fuelType")} className={selectClasses}>
                  <option value="petrol">Combustion (P)</option>
                  <option value="diesel">Combustion (D)</option>
                  <option value="electric">Electric (EV)</option>
                  <option value="hybrid">Hybrid (HEV)</option>
                </select>
              </InputWrapper>
              <InputWrapper label="Drivetrain" index={3}>
                <select {...register("transmitionType")} className={selectClasses}>
                  <option value="automatic">Auto-Link</option>
                  <option value="manual">Manual Override</option>
                </select>
              </InputWrapper>
              <InputWrapper label="Occupancy" index={4}>
                <select {...register("Seats")} className={selectClasses}>
                  <option value="5">5 Units</option>
                  <option value="7">7 Units</option>
                  <option value="8">8 Units</option>
                </select>
              </InputWrapper>
            </div>
          </Section>

          <Section num="04" title="Deployment Sector" subtitle="Assign operational territory parameters.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InputWrapper label="Primary Hub" error={errors.vehicleLocation} index={1}>
                <select {...register("vehicleLocation", { required: true })} className={selectClasses}>
                  <option value="">Awaiting Sector...</option>
                  {locationData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>
              <InputWrapper label="Regional Zone" error={errors.vehicleDistrict} index={2}>
                <select {...register("vehicleDistrict", { required: true })} className={selectClasses}>
                  <option value="">Awaiting Zone...</option>
                  {districtData?.map((cur, idx) => (
                    <option key={idx} value={cur}>{cur}</option>
                  ))}
                </select>
              </InputWrapper>
            </div>
          </Section>

          <Section num="05" title="Compliance Validation" subtitle="Legal clearances and expirations.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <InputWrapper label="Insurance Void Date" error={errors.insurance_end_date} index={1}>
                <input type="date" {...register("insurance_end_date", { required: true })} className={inputClasses} />
              </InputWrapper>
              <InputWrapper label="Registration Void Date" error={errors.Registeration_end_date} index={2}>
                <input type="date" {...register("Registeration_end_date", { required: true })} className={inputClasses} />
              </InputWrapper>
              <InputWrapper label="Emission Void Date" error={errors.polution_end_date} index={3}>
                <input type="date" {...register("polution_end_date", { required: true })} className={inputClasses} />
              </InputWrapper>
            </div>
          </Section>

          <Section num="06" title="Data Assets" subtitle="Authenticate via visual schematics and scanned logs.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <FileUploadCard registerName="insurance_image" label="Insurance Log" subtitle="Encrypted Policy Document" required={true} delay={0.1} />
              <FileUploadCard registerName="rc_book_image" label="Registration Log" subtitle="RC / Verification Document" required={true} delay={0.2} />
              <FileUploadCard registerName="polution_image" label="Emission Log" subtitle="PUC Certification" required={true} delay={0.3} />

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative group md:col-span-2 mt-4"
              >
                <input type="file" multiple {...register("image", { required: true })} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-slate-950/20 rounded-[2rem] p-12 transition-all duration-500 group-hover:border-emerald-500/40 group-hover:bg-emerald-950/20 shadow-inner">
                  <div className="absolute -inset-20 bg-emerald-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  <div className="relative h-20 w-20 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-500">
                    <HiOutlineCloudUpload size={40} />
                  </div>
                  <p className="relative text-sm font-black text-slate-200 tracking-wider uppercase mb-2">Drop Visual Schematics Here</p>
                  <p className="relative text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] text-center max-w-sm leading-relaxed">
                    High definition captures required. System accepts standard imaging protocols (JPG, PNG).
                  </p>
                </div>
                {errors.image && (
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[9px] font-bold text-rose-500 bg-slate-950 px-3 py-1 rounded-full border border-rose-500/20 shadow-lg">
                    <HiOutlineExclamationCircle size={12} /> Visual Data Matrix required
                  </span>
                )}
              </motion.div>
            </div>
          </Section>

          {/* Floating Actions Strip */}
          <div className="sticky bottom-0 left-0 w-full pt-8 z-50 pointer-events-none mt-10">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.5)] pointer-events-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleClose}
                className="w-full md:w-auto px-10 py-5 md:py-0 rounded-2xl bg-slate-900 border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
              >
                Abort
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="relative flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-[1px] group disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full w-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] py-5">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-950 drop-shadow-md">
                    {loading ? "INITIALIZING SEQUENCE..." : "Execute Deployment"}
                  </span>
                  <HiOutlineChevronRight className="absolute right-6 text-slate-950 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" size={20} />
                </div>
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VendorAddProductModal;
