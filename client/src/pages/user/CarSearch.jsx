import { IconCalendarEvent, IconMapPinFilled } from "@tabler/icons-react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import { setAvailableCars, setLocationsOfDistrict, setSelectedDistrict } from "../../redux/user/selectRideSlice";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { setSelectedData } from "../../redux/user/BookingDataSlice";
import dayjs from "dayjs";
import useFetchLocationsLov from "../../hooks/useFetchLocationsLov";
import { motion } from "framer-motion";
import PremiumButton from "../../components/ui/PremiumButton";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import { toast } from "sonner";

const schema = z.object({
  dropoff_location: z.string().min(1, { message: "Dropoff location needed" }),
  pickup_district: z.string().min(1, { message: "Pickup District needed" }),
  pickup_location: z.string().min(1, { message: "Pickup Location needed" }),
  pickuptime: z.object({ $d: z.instanceof(Date) }),
  dropofftime: z.object({ $d: z.instanceof(Date) }),
});

const CarSearch = () => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { pickup_district: "", pickup_location: "", dropoff_location: "", pickuptime: null, dropofftime: null },
  });

  const navigate = useNavigate();
  const { districtData } = useSelector((state) => state.modelDataSlice);
  const { fetchLov, isLoading } = useFetchLocationsLov();
  const uniqueDistrict = districtData?.filter((cur, idx) => cur !== districtData[idx + 1]);
  const { selectedDistrict, wholeData, locationsOfDistrict } = useSelector((state) => state.selectRideSlice);

  const [pickup, setPickup] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => { fetchLov(); }, []);

  useEffect(() => {
    if (selectedDistrict !== null) {
      const showLocationInDistrict = wholeData.filter((cur) => cur.district === selectedDistrict).map((cur) => cur.location);
      dispatch(setLocationsOfDistrict(showLocationInDistrict));
    }
  }, [selectedDistrict, wholeData, dispatch]);

  const hanldeData = async (data) => {
    try {
      dispatch(setSelectedData(data));
      const datas = {
        pickupDate: data.pickuptime.$d,
        dropOffDate: data.dropofftime.$d,
        pickUpDistrict: data.pickup_district,
        pickUpLocation: data.pickup_location,
      };

      const res = await fetch("api/user/showSingleofSameModel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message);
        toast.error(errData.message || "Could not fetch available cars");
        return;
      }

      const result = await res.json();
      dispatch(setAvailableCars(result));
      toast.success("Vehicles loaded successfully");
      navigate("/availableVehicles");
    } catch (err) {
      console.log("Error:", err);
      toast.error("Unexpected error while searching vehicles");
    }
  };

  const oneDayGap = pickup && pickup.add(1, "day");

  return (
    <section id="booking-section" className="my-14">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-white/45 bg-white/75 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.14)] backdrop-blur-xl md:p-8"
      >
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Book a premium car</h2>
            <p className="mt-1 text-sm text-slate-500">Select location and time to get the best options instantly.</p>
          </div>
        </div>

        {isLoading && <div className="mb-4 overflow-hidden rounded-xl"><SkeletonLoader /></div>}

        <form onSubmit={handleSubmit(hanldeData)} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="pickup_district" className="flex items-center gap-2 text-sm font-medium text-slate-700"><IconMapPinFilled size={16} /> Pick-up District</label>
            <Controller name="pickup_district" control={control} render={({ field }) => (
              <TextField {...field} id="pickup_district" fullWidth select error={Boolean(errors.pickup_district)} onChange={(e) => { field.onChange(e.target.value); dispatch(setSelectedDistrict(e.target.value)); }}>
                {!isLoading && <MenuItem value="">Select a district</MenuItem>}
                {uniqueDistrict?.map((cur, idx) => <MenuItem value={cur} key={idx}>{cur}</MenuItem>)}
              </TextField>
            )} />
            {errors.pickup_district && <p className="text-xs text-rose-500">{errors.pickup_district.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="pickup_location" className="flex items-center gap-2 text-sm font-medium text-slate-700"><IconMapPinFilled size={16} /> Pick-up Location</label>
            <Controller name="pickup_location" control={control} render={({ field }) => (
              <TextField {...field} id="pickup_location" fullWidth select error={Boolean(errors.pickup_location)}>
                <MenuItem value="">Select location</MenuItem>
                {locationsOfDistrict?.map((loc, idx) => <MenuItem value={loc} key={idx}>{loc}</MenuItem>)}
              </TextField>
            )} />
            {errors.pickup_location && <p className="text-xs text-rose-500">{errors.pickup_location.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="dropoff_location" className="flex items-center gap-2 text-sm font-medium text-slate-700"><IconMapPinFilled size={16} /> Drop-off Location</label>
            <Controller name="dropoff_location" control={control} render={({ field }) => (
              <TextField {...field} id="dropoff_location" fullWidth select error={Boolean(errors.dropoff_location)}>
                <MenuItem value="">Select location</MenuItem>
                {locationsOfDistrict?.map((loc, idx) => <MenuItem value={loc} key={idx}>{loc}</MenuItem>)}
              </TextField>
            )} />
            {errors.dropoff_location && <p className="text-xs text-rose-500">{errors.dropoff_location.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><IconCalendarEvent size={16} /> Pick-up Date</label>
            <Controller name="pickuptime" control={control} render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}><DemoContainer components={["DateTimePicker"]}><DateTimePicker label="Pickup time" {...field} minDate={dayjs()} onChange={(newValue) => { field.onChange(newValue); setPickup(newValue); }} /></DemoContainer></LocalizationProvider>
            )} />
            {errors.pickuptime && <p className="text-xs text-rose-500">{errors.pickuptime.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><IconCalendarEvent size={16} /> Drop-off Date</label>
            <Controller name="dropofftime" control={control} render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}><DemoContainer components={["DateTimePicker"]}><DateTimePicker label="Dropoff time" {...field} minDate={pickup ? oneDayGap : dayjs()} /></DemoContainer></LocalizationProvider>
            )} />
            {errors.dropofftime && <p className="text-xs text-rose-500">{errors.dropofftime.message}</p>}
            {error && <p className="text-xs text-rose-500">{error}</p>}
          </div>

          <div className="flex items-end">
            <PremiumButton type="submit" className="w-full">Search Vehicles</PremiumButton>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default CarSearch;
