import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { showVehicles } from "../../redux/user/listAllVehicleSlice";

// Icons
import { 
  HiOutlineArrowLeft, 
  HiStar, 
  HiOutlineShieldCheck, 
  HiOutlineClock, 
  HiOutlineCalendar,
  HiOutlineLocationMarker
} from "react-icons/hi";
import { 
  GiGearStickPattern, 
  GiCarDoor, 
  GiGasPump 
} from "react-icons/gi";
import { MdAirlineSeatReclineExtra, MdOutlineSpeed } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const VehicleDetails = () => {
  const { singleVehicleDetail } = useSelector((state) => state.userListVehicles);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDates, setSelectedDates] = useState({ start: "", end: "" });

  let refreshToken = localStorage.getItem("refreshToken");
  let accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/listAllVehicles", {
          headers: { "Authorization": `Bearer ${refreshToken},${accessToken}` },
        });
        const data = await res.json();
        dispatch(showVehicles(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch, refreshToken, accessToken]);

  if (!singleVehicleDetail) return null;

  const handleBook = () => {
    navigate("/checkoutPage");
  };

  const specs = [
    { icon: GiGearStickPattern, label: "Transmission", value: singleVehicleDetail.transmition },
    { icon: MdAirlineSeatReclineExtra, label: "Seats", value: `${singleVehicleDetail.seats} Adults` },
    { icon: GiGasPump, label: "Fuel Type", value: singleVehicleDetail.fuel_type },
    { icon: MdOutlineSpeed, label: "Max Speed", value: "240 km/h" },
    { icon: GiCarDoor, label: "Doors", value: "4 Doors" },
    { icon: IoShieldCheckmarkOutline, label: "Safety", value: "5-Star" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="fixed bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        {/* Navigation */}
        <Link 
          to="/vehicles" 
          className="group mb-12 inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-emerald-500"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all group-hover:border-emerald-500/30">
            <HiOutlineArrowLeft />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Back to Fleet</span>
        </Link>

        <div className="grid gap-16 lg:grid-cols-12">
          {/* LEFT: Cinematic Gallery */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6 }}
                  src={singleVehicleDetail.image[activeImage]}
                  alt={singleVehicleDetail.name}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            </div>

            {/* Thumbnails */}
            <div className="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {singleVehicleDetail.image.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImage === idx ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20' : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Description Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <h3 className="mb-6 font-heading text-3xl font-bold">The Experience</h3>
              <p className="text-lg leading-relaxed text-slate-400">
                {singleVehicleDetail.car_description || "Experience the pinnacle of automotive engineering. This luxury vehicle combines breathtaking performance with unrivaled comfort, making every journey a memorable escape."}
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3">
                {specs.map((spec, i) => (
                  <div key={i} className="flex flex-col gap-3">
                     <spec.icon className="text-emerald-500" size={24} />
                     <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{spec.label}</p>
                        <p className="text-sm font-semibold text-slate-200">{spec.value}</p>
                     </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Booking Dashboard (Sticky) */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-10 backdrop-blur-xl shadow-2xl"
            >
              <div className="mb-8">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-bold uppercase tracking-widest text-emerald-500">{singleVehicleDetail.company}</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-300">
                    <HiStar className="text-yellow-500" /> {singleVehicleDetail.ratting || "4.9"} (120 Reviews)
                  </div>
                </div>
                <h2 className="font-heading text-4xl font-extrabold">{singleVehicleDetail.name}</h2>
              </div>

              {/* Pricing */}
              <div className="mb-10 flex items-baseline gap-2">
                <span className="flex items-center text-4xl font-black text-white">
                  <FaIndianRupeeSign size={24} />
                  {singleVehicleDetail.price}
                </span>
                <span className="text-slate-400 font-medium">/ per day</span>
              </div>

              {/* Booking Form (Mock) */}
              <div className="mb-10 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Pick-up</label>
                       <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-800/50 p-4 transition-all hover:border-emerald-500/30">
                          <HiOutlineCalendar className="text-emerald-500" />
                          <input type="date" className="bg-transparent text-sm outline-none w-full" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Drop-off</label>
                       <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-800/50 p-4 transition-all hover:border-emerald-500/30">
                          <HiOutlineCalendar className="text-emerald-500" />
                          <input type="date" className="bg-transparent text-sm outline-none w-full" />
                       </div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Pick-up Location</label>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-800/50 p-4 transition-all hover:border-emerald-500/30">
                       <HiOutlineLocationMarker className="text-emerald-500" />
                       <span className="text-sm font-medium">Main Showroom, MG Road</span>
                    </div>
                 </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBook}
                className="w-full rounded-2xl bg-emerald-600 py-5 text-lg font-bold text-white transition-all hover:bg-emerald-500"
              >
                Proceed to Checkout
              </motion.button>

              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/5 pt-8">
                 <div className="flex items-center gap-3 text-slate-400">
                    <HiOutlineShieldCheck className="text-emerald-500" size={20} />
                    <span className="text-xs font-bold uppercase">Fully Insured</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-400">
                    <HiOutlineClock className="text-emerald-500" size={20} />
                    <span className="text-xs font-bold uppercase">24/7 Support</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar Vehicles (Mock Layout) */}
        <div className="mt-32">
           <h3 className="mb-12 font-heading text-3xl font-bold">Clients Recents</h3>
           <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card overflow-hidden rounded-[2rem] p-6 lg:p-8">
                   <div className="mb-4 aspect-video overflow-hidden rounded-2xl">
                      <img src={singleVehicleDetail.image[0]} className="h-full w-full object-cover transition-transform hover:scale-110" />
                   </div>
                   <h4 className="text-xl font-bold">Similar Variant {i}</h4>
                   <p className="mt-2 text-emerald-500 font-bold">₹{singleVehicleDetail.price} / Day</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
