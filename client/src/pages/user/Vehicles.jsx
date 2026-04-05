import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setVariants,
  setVehicleDetail,
  showVehicles,
} from "../../redux/user/listAllVehicleSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../redux/user/userSlice";
import { API } from "../../constants";

// Icons
import {
  HiOutlineFilter,
  HiChevronDown,
  HiOutlineUserGroup,
  HiOutlineColorSwatch,
  HiOutlineBeaker,
  HiOutlineArrowRight
} from "react-icons/hi";
import { BsFillFuelPumpFill } from "react-icons/bs";

// Components
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import SkeletonLoader from "../../components/ui/SkeletonLoader";

export const onVehicleDetail = async (id, dispatch, navigate) => {
  try {
    const res = await API.post("/user/showVehicleDetails", { id });
    dispatch(setVehicleDetail(res.data));
    navigate("/vehicleDetails");
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      dispatch(signOut());
    }
    console.log(error);
  }
};

const Vehicles = () => {
  const { userAllVehicles } = useSelector((state) => state.userListVehicles);
  const { filterdData } = useSelector((state) => state.sortfilterSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(setVariants(null));
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/user/listAllVehicles");
        dispatch(showVehicles(res.data));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const vehiclesToRender = useMemo(() => {
    const source = filterdData && filterdData.length > 0 ? filterdData : userAllVehicles;
    if (!Array.isArray(source)) return [];
    return source.filter(
      (cur) => (cur.isDeleted === false || cur.isDeleted === "false") && cur.isAdminApproved
    );
  }, [filterdData, userAllVehicles]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      {/* Header Section */}
      <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <h1 className="font-heading text-4xl font-extrabold text-white md:text-5xl">
            Our <span className="text-emerald-500">Fleet</span>
          </h1>
          <p className="mt-3 text-slate-400">Discover excellence in every drive. Curated for your comfort.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 px-6 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 lg:hidden"
          >
            <HiOutlineFilter /> Filters
          </button>
          <div className="hidden lg:block">
            <Sort />
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Sidebar Filter - Desktop */}
        <aside className="sticky top-28 hidden h-fit lg:col-span-3 lg:block">
          <div className="glass-card rounded-[2rem] p-8">
            <Filter />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed top-0 left-0 z-[1200] h-full w-[85%] max-w-sm bg-slate-950 p-8 lg:hidden shadow-2xl"
              >
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-white">
                    <HiChevronDown className="rotate-90 size-6" />
                  </button>
                </div>
                <Filter onApply={() => setIsFilterOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <main className="lg:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
            </div>
          ) : vehiclesToRender.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {vehiclesToRender.map((vehicle, idx) => (
                <motion.div
                  key={vehicle._id || idx}
                  variants={cardVariants}
                  className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-white/5 transition-all hover:border-emerald-500/20"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={vehicle.image?.[0]}
                      alt={vehicle.name}
                      className="h-full w-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute top-5 left-5 z-20">
                      <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                        {vehicle.car_type}
                      </span>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="flex flex-1 flex-col p-8">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">{vehicle.company}</p>
                        <h3 className="mt-1 text-2xl font-bold font-heading text-white line-clamp-1">{vehicle.name}</h3>
                      </div>
                    </div>

                    <div className="mb-8 grid grid-cols-2 gap-y-4 gap-x-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <BsFillFuelPumpFill className="text-emerald-500/60" size={14} />
                        <span className="text-sm font-medium">{vehicle.fuel_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <HiOutlineUserGroup className="text-emerald-500/60" size={14} />
                        <span className="text-sm font-medium">{vehicle.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <HiOutlineBeaker className="text-emerald-500/60" size={14} />
                        <span className="text-sm font-medium">Automatic</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <HiOutlineColorSwatch className="text-emerald-500/60" size={14} />
                        <span className="text-sm font-medium">Metallic</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Price per day</p>
                        <p className="text-2xl font-black text-white">₹{vehicle.price}</p>
                      </div>
                      <button
                        onClick={() => onVehicleDetail(vehicle._id, dispatch, navigate)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white transition-all hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      >
                        <HiOutlineArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-700">
                <HiOutlineFilter size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white">No vehicles found</h3>
              <p className="mt-2 text-slate-400">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Vehicles;
