import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineCheckBadge, HiOutlineShieldCheck, HiOutlineCreditCard, HiOutlineCalendar, HiOutlineMapPin, HiCurrencyRupee } from "react-icons/hi2";
import { Toaster, toast } from "sonner";

// Internal
import { displayRazorpay } from "./Razorpay";
import { setPageLoading } from "../../redux/user/userSlice";
import { setisPaymentDone } from "../../redux/user/LatestBookingsSlice";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  adress: z.string().min(5, "Full address is required"),
  coupon: z.string().optional(),
});

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors, isValid }, trigger } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const { pickup_district, pickup_location, dropoff_location, dropofftime, pickupDate, dropoffDate } = useSelector((state) => state.bookingDataSlice);
  const { data, paymentDone } = useSelector((state) => state.latestBookingsSlice);
  const currentUser = useSelector((state) => state.user.currentUser);
  const singleVehicleDetail = useSelector((state) => state.userListVehicles.singleVehicleDetail);
  const { isPageLoading } = useSelector((state) => state.user);

  // Pricing Logic
  const start = pickupDate?.humanReadable ? new Date(pickupDate.humanReadable) : new Date();
  const end = dropoffDate?.humanReadable ? new Date(dropoffDate.humanReadable) : new Date();
  const diffMilliseconds = end - start;
  const Days = Math.max(1, Math.round(diffMilliseconds / (1000 * 3600 * 24)));

  const [discount, setDiscount] = useState(0);
  const couponValue = watch("coupon");
  
  const handleCoupon = () => {
    if (couponValue === "WELCOME50") {
      setDiscount(50);
      toast.success("Coupon applied: WELCOME50");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code");
    }
  };

  const totalPrice = (singleVehicleDetail.price * Days) + 50 - discount;

  const handleNext = async () => {
    if (step === 2) {
      const isStepValid = await trigger(["email", "phoneNumber", "adress"]);
      if (isStepValid) setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      user_id: currentUser._id,
      vehicle_id: singleVehicleDetail._id,
      totalPrice,
      pickupDate: pickupDate.humanReadable,
      dropoffDate: dropoffDate.humanReadable,
      pickup_district,
      pickup_location,
      dropoff_location,
    };

    try {
      dispatch(setPageLoading(true));
      const res = await displayRazorpay(orderData, navigate, dispatch);
      if (!res?.ok) toast.error(res?.message || "Payment initialization failed");
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setPageLoading(false));
    }
  };

  useEffect(() => {
    if (paymentDone && data) {
      dispatch(setisPaymentDone(false));
    }
  }, [paymentDone, data, dispatch]);

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const inputClasses = "w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-semibold text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-white/10 placeholder:text-slate-600";

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6 lg:px-20">
      <Toaster richColors position="top-right" />
      
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Wizard Flow */}
        <div className="flex-1 space-y-12">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-black transition-all ${
                  step >= i ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "bg-white/5 text-slate-500"
                }`}>
                  {i}
                </div>
                {i < 3 && <div className={`h-1 w-12 rounded-full ${step > i ? "bg-emerald-500" : "bg-white/5"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" {...stepVariants} className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tight uppercase">Verify Reservation</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Step 01: Fleet & Schedule Confirmation</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="glass-card p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-emerald-500">
                        <HiOutlineCalendar size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <p className="text-xs font-bold text-slate-500 uppercase">Start</p>
                          <p className="text-sm font-black text-white">{new Date(pickupDate.humanReadable).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs font-bold text-slate-500 uppercase">End</p>
                          <p className="text-sm font-black text-white">{new Date(dropoffDate.humanReadable).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-4">
                          <p className="text-xs font-bold text-slate-500 uppercase">Duration</p>
                          <p className="text-sm font-black text-emerald-500">{Days} Days</p>
                        </div>
                      </div>
                   </div>

                   <div className="glass-card p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-emerald-500">
                        <HiOutlineMapPin size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Pickup Location</p>
                          <p className="text-xs font-bold text-white">{pickup_location}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Return Terminal</p>
                          <p className="text-xs font-bold text-white">{dropoff_location}</p>
                        </div>
                      </div>
                   </div>
                </div>

                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="flex items-center gap-3 rounded-2xl bg-emerald-500 px-10 py-5 text-sm font-black uppercase tracking-widest text-slate-950 shadow-xl shadow-emerald-500/10"
                >
                  Proceed to Secure Checkout
                  <HiOutlineArrowRight size={20} />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" {...stepVariants} className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tight uppercase">Billing Information</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Step 02: Authorized Contact Details</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Secure Email Address</label>
                    <input {...register("email")} defaultValue={currentUser.email} className={inputClasses} placeholder="your@email.com" />
                    {errors.email && <p className="text-rose-500 text-[10px] font-bold ml-2 uppercase tracking-widest">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Mobile Terminal (Phone)</label>
                    <input {...register("phoneNumber")} defaultValue={currentUser.phoneNumber} className={inputClasses} placeholder="+91 00000 00000" />
                    {errors.phoneNumber && <p className="text-rose-500 text-[10px] font-bold ml-2 uppercase tracking-widest">{errors.phoneNumber.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Residency (Full Address)</label>
                    <textarea {...register("adress")} defaultValue={currentUser.adress} rows={3} className={`${inputClasses} resize-none`} placeholder="House No, Street, Landmark..." />
                    {errors.adress && <p className="text-rose-500 text-[10px] font-bold ml-2 uppercase tracking-widest">{errors.adress.message}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(1)}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/5 px-8 py-5 text-sm font-black uppercase tracking-widest text-slate-300"
                  >
                    <HiOutlineArrowLeft size={20} />
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-10 py-5 text-sm font-black uppercase tracking-widest text-slate-950 shadow-xl shadow-emerald-500/10"
                  >
                    Finalize Transaction
                    <HiOutlineArrowRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" {...stepVariants} className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tight uppercase">Confirm & Authorize</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Step 03: Final Authorization & Payment</p>
                </div>

                <div className="glass-card p-8 border-emerald-500/20 bg-emerald-500/5">
                   <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950">
                        <HiOutlineShieldCheck size={28} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Security Guaranteed</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Encrypted SSL transaction via Razorpay Secure 3.0</p>
                      </div>
                   </div>
                </div>

                {/* Coupon System */}
                <div className="flex gap-4">
                  <input {...register("coupon")} className={inputClasses} placeholder="Enter luxury code (e.g. WELCOME50)" />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => { e.preventDefault(); handleCoupon(); }}
                    className="px-8 rounded-2xl bg-white/10 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/20"
                  >
                    Apply
                  </motion.button>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/5 px-8 py-5 text-sm font-black uppercase tracking-widest text-slate-300"
                  >
                    <HiOutlineArrowLeft size={20} />
                    Refine Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit(handlePlaceOrder)}
                    disabled={isPageLoading}
                    className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-10 py-5 text-sm font-black uppercase tracking-widest text-slate-950 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isPageLoading ? "Processing Authorization..." : "Authorize Rental Payment"}
                    {!isPageLoading && <HiOutlineCreditCard size={20} />}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Order Summary Stickey */}
        <div className="lg:w-96">
          <div className="sticky top-32 glass-card overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-slate-900">
               <img src={singleVehicleDetail.image[0]} className="h-full w-full object-contain" alt="fleet" />
            </div>
            <div className="p-8 space-y-6">
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Precision Fleet</p>
                <h3 className="text-xl font-black text-white tracking-tight uppercase flex items-center justify-between">
                  {singleVehicleDetail.name}
                  <span className="text-xs inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-500">
                    <HiOutlineCheckBadge /> 4.9
                  </span>
                </h3>
              </div>

              <div className="space-y-3 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-500 uppercase">Base Rental</span>
                  <span className="font-black text-white">₹{singleVehicleDetail.price} × {Days} Days</span>
                </div>
                <div className="flex justify-between text-xs border-b border-white/5 pb-6">
                  <span className="font-bold text-slate-500 uppercase">Operational Fee</span>
                  <span className="font-black text-white">₹50.00</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-emerald-500 uppercase">Luxury Discount</span>
                    <span className="font-black text-emerald-500">- ₹{discount}.00</span>
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <span className="text-sm font-black text-white uppercase tracking-tighter">Total Liability</span>
                  <span className="text-2xl font-black text-white tracking-tighter flex items-center gap-1">
                    <HiCurrencyRupee className="text-emerald-500" />
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                 <HiOutlineShieldCheck className="text-emerald-500" size={24} />
                 <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">
                   Full collision waiver included. Verified fleet maintenance records confirmed for this vehicle.
                 </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
