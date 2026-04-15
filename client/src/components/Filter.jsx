import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setFilteredData } from "../redux/user/sortfilterSlice";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronDown, HiCheck } from "react-icons/hi";
import { useState } from "react";
import API_BASE_URL from "../config/api";

const FilterGroup = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="border-b border-white/5 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left group"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-slate-500"
        >
          <HiOutlineChevronDown size={18} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomCheckbox = ({ label, name, control }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange } }) => (
      <label className="flex cursor-pointer items-center group">
        <div className="relative flex h-5 w-5 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-all group-hover:border-emerald-500/50">
          <input
            type="checkbox"
            className="sr-only"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
          />
          {value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-emerald-500"
            >
              <HiCheck size={14} strokeWidth={3} />
            </motion.div>
          )}
        </div>
        <span className={`ml-3 text-sm font-medium transition-colors ${value ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
          {label}
        </span>
      </label>
    )}
  />
);

const Filter = ({ onApply }) => {
  const { control, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { userAllVehicles, allVariants } = useSelector((state) => state.userListVehicles);
  const { variantMode } = useSelector((state) => state.sortfilterSlice);

  const handleData = async (data) => {
    const typeMapping = {
      suv: "car_type",
      sedan: "car_type",
      hatchback: "car_type",
      automatic: "transmition",
      manual: "transmition",
    };

    const transformedData = Object.entries(data)
      .filter(([_, value]) => value === true)
      .map(([key]) => ({ [key]: true, type: typeMapping[key] }));

    if (transformedData.length === 0 && !variantMode) {
      dispatch(setFilteredData(userAllVehicles));
    } else if (transformedData.length > 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/filterVehicles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transformedData),
        });

        if (res.ok) {
          const result = await res.json();
          const filtData = result.data.filteredVehicles;

          if (allVariants) {
            const filteredData = filtData.filter((d) =>
              allVariants.some((variant) => variant._id === d._id)
            );
            dispatch(setFilteredData(filteredData));
          } else {
            dispatch(setFilteredData(filtData));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (onApply) onApply();
  };

  return (
    <form onSubmit={handleSubmit(handleData)} className="flex flex-col h-full">
      <div className="flex-1">
        <FilterGroup title="Vehicle Type">
          <CustomCheckbox label="SUV" name="suv" control={control} />
          <CustomCheckbox label="Sedan" name="sedan" control={control} />
          <CustomCheckbox label="Hatchback" name="hatchback" control={control} />
        </FilterGroup>

        <FilterGroup title="Transmission">
          <CustomCheckbox label="Automatic" name="automatic" control={control} />
          <CustomCheckbox label="Manual" name="manual" control={control} />
        </FilterGroup>

        <FilterGroup title="Fuel Type">
          <CustomCheckbox label="Petrol" name="petrol" control={control} />
          <CustomCheckbox label="Diesel" name="diesel" control={control} />
          <CustomCheckbox label="Electric" name="electric" control={control} />
        </FilterGroup>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500"
        >
          Apply Filters
        </motion.button>
        <button
          type="button"
          onClick={() => {
            reset();
            dispatch(setFilteredData(userAllVehicles));
            if (onApply) onApply();
          }}
          className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white"
        >
          Reset All
        </button>
      </div>
    </form>
  );
};

export default Filter;
