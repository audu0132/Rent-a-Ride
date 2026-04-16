import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setCompanyData,
  setDistrictData,
  setLocationData,
  setModelData,
} from "../redux/adminSlices/adminDashboardSlice/CarModelDataSlice";
import { setWholeData } from "../redux/user/selectRideSlice";
import API_BASE_URL from "../config/api";

// --- Types ---
interface VehicleItem {
  type: "car";
  model: string;
  brand: string;
}

interface LocationItem {
  type: "location";
  location: string;
  district: string;
}

type ApiResponseItem = VehicleItem | LocationItem;

interface UseFetchLocationsLovReturn {
  fetchLov: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// --- Hook ---
const useFetchLocationsLov = (): UseFetchLocationsLovReturn => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLov = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/admin/getVehicleModels`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data (status ${res.status})`);
      }

      const data: ApiResponseItem[] = await res.json();

      // --- Single-pass: separate cars and locations ---
      const cars = data.filter((item): item is VehicleItem => item.type === "car");
      const locations = data.filter((item): item is LocationItem => item.type === "location");

      // Models
      const models = cars.map((car) => car.model);
      dispatch(setModelData(models));

      // Unique brands (companies)
      const uniqueBrands = [...new Set(cars.map((car) => car.brand))];
      dispatch(setCompanyData(uniqueBrands));

      // Locations
      const locationNames = locations.map((loc) => loc.location);
      dispatch(setLocationData(locationNames));

      // Unique districts
      const uniqueDistricts = [...new Set(locations.map((loc) => loc.district))];
      dispatch(setDistrictData(uniqueDistricts));

      // Whole location data
      dispatch(setWholeData(locations));

    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      console.error("[useFetchLocationsLov]", message);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchLov, isLoading, error };
};

export default useFetchLocationsLov;
