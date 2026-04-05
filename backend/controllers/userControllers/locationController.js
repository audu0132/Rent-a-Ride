import Vehicle from "../../models/vehicleModel.js";

// ✅ Get all states
export const getStates = async (req, res) => {
  try {
    const states = await Vehicle.distinct("state");
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Error fetching states" });
  }
};

// ✅ Get cities based on state
export const getCitiesByState = async (req, res) => {
  try {
    const { state } = req.params;

    const cities = await Vehicle.distinct("district", {
      state: state,
    });

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities" });
  }
};
// ✅ Get vehicles based on state + city
export const getVehicles = async (req, res) => {
  try {
    const { state, city } = req.query;

    const vehicles = await Vehicle.find({
      state: { $regex: state, $options: "i" },
      district: { $regex: city, $options: "i" },
      isDeleted: false,
      isBooked: false,
      
    });

    if (vehicles.length === 0) {
      return res.status(404).json({ message: "No vehicles found" });
    }

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicles" });
  }
};