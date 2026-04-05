import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker, HiCalendar, HiSearch } from "react-icons/hi";

const locationData = {
  Maharashtra: ["Pune", "Mumbai", "Nagpur", "Nashik"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Kerala: ["Kochi", "Trivandrum", "Thrissur"],
};

export default function CarSearch() {
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [dropCity, setDropCity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!stateName || !city || !dropCity || !pickupDate || !dropoffDate) {
      alert("Please fill all fields first.");
      return;
    }

    if (new Date(dropoffDate) <= new Date(pickupDate)) {
      alert("Drop-off date must be greater than pickup date.");
      return;
    }

    const query = new URLSearchParams({
      district: city,
      pickup_location: city,
      dropoff_location: dropCity,
      pickupDate,
      dropoffDate,
    }).toString();

    navigate(`/availableVehicles?${query}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative z-10 w-full rounded-[2rem] border border-white/10 bg-slate-900/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-10 lg:max-w-6xl"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="h-1.5 w-12 rounded-full bg-emerald-500" />
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          Find Your Perfect Ride
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* State Selection */}
        <div className="relative group">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
            Pick-up State
          </label>
          <div className="relative">
            <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
            <select
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/50 p-4 pl-12 text-sm text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-slate-800/80"
              value={stateName}
              onChange={(e) => {
                setStateName(e.target.value);
                setCity("");
                setDropCity("");
              }}
            >
              <option value="" className="bg-slate-900">Select State</option>
              {Object.keys(locationData).map((state) => (
                <option key={state} value={state} className="bg-slate-900">
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="relative group">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
            Pick-up City
          </label>
          <div className="relative">
            <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" />
            <select
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/50 p-4 pl-12 text-sm text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-slate-800/80 disabled:opacity-50"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!stateName}
            >
              <option value="" className="bg-slate-900">Select City</option>
              {stateName &&
                locationData[stateName].map((item) => (
                  <option key={item} value={item} className="bg-slate-900">
                    {item}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Dropoff Location */}
        <div className="relative group">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
            Drop-off City
          </label>
          <div className="relative">
            <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" />
            <select
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/50 p-4 pl-12 text-sm text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-slate-800/80 disabled:opacity-50"
              value={dropCity}
              onChange={(e) => setDropCity(e.target.value)}
              disabled={!stateName}
            >
              <option value="" className="bg-slate-900">Select City</option>
              {stateName &&
                locationData[stateName].map((item) => (
                  <option key={item} value={item} className="bg-slate-900">
                    {item}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="relative group">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
            Pickup Date & Time
          </label>
          <div className="relative">
            <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-white/10 bg-slate-800/50 p-4 pl-12 text-sm text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-slate-800/80 [color-scheme:dark]"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
        </div>

        <div className="relative group">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
            Return Date & Time
          </label>
          <div className="relative">
            <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-white/10 bg-slate-800/50 p-4 pl-12 text-sm text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-slate-800/80 [color-scheme:dark]"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 p-4 font-black uppercase tracking-widest text-slate-950 transition-all hover:bg-emerald-400"
          >
            <HiSearch className="text-xl transition-transform group-hover:scale-110" />
            Search Vehicles
          </motion.button>
        </div>
      </div>

      {/* Subtle Glows */}
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-[80px]" />
    </motion.div>
  );
}
