import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCarSide } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { useDispatch } from "react-redux";

import CarNotFound from "./CarNotFound";
import { API } from "../../constants";
import { setVehicleDetail } from "../../redux/user/listAllVehicleSlice";
import { signOut } from "../../redux/user/userSlice";

const onVehicleDetail = async (id, dispatch, navigate) => {
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

function AvailableVehiclesAfterSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const district =
      params.get("district") ||
      params.get("city") ||
      params.get("pickup_location");

    const fetchVehicles = async () => {
      try {
        setIsLoading(true);

        const res = await API.get("/user/listAllVehicles", {
          params: { city: district },
        });

        setVehicles(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (district) {
      fetchVehicles();
    } else {
      setVehicles([]);
      setIsLoading(false);
    }
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <div className="text-xl font-semibold animate-pulse tracking-wides text-emerald-200">Loading vehicles...</div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return <CarNotFound />;
  }

  return (
    <div className="relative min-h-screen bg-[#020617] px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold">Available Vehicles</h2>
          <p className="mt-2 text-sm text-gray-400">
            Choose from premium cars available for your selected location.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((cur, idx) => (
            <motion.div
              key={cur._id || idx}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl"
            >
              <img
                src={cur.image?.[0]}
                alt={cur.name}
                className="mb-4 h-52 w-full rounded-xl object-cover"
              />

              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold capitalize">{cur.name}</h2>
                <div className="text-right">
                  <p className="font-bold text-green-400">₹{cur.price}</p>
                  <p className="text-xs text-gray-400">Per Day</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2">
                    <FaCarSide /> {cur.company}
                  </p>
                  <p className="flex items-center gap-2">
                    <MdAirlineSeatReclineNormal /> {cur.seats}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2">
                    <FaCarSide /> {cur.car_type}
                  </p>
                  <p className="flex items-center gap-2">
                    <BsFillFuelPumpFill /> {cur.fuel_type}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  className="w-full rounded-xl bg-green-500 px-4 py-3 font-semibold text-black transition hover:bg-green-400"
                  onClick={() => onVehicleDetail(cur._id, dispatch, navigate)}
                >
                  Book Ride
                </button>

                <button
                  className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
                  onClick={() => onVehicleDetail(cur._id, dispatch, navigate)}
                >
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvailableVehiclesAfterSearch;