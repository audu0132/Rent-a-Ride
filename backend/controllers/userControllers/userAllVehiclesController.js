import vehicle from "../../models/vehicleModel.js";
import Booking from "../../models/BookingModel.js";
import { errorHandler } from "../../utils/error.js";

// show all vehicles to user
export const listAllVehicles = async (req, res, next) => {
  try {
    const city = req.query.city?.trim();

    const query = {
      isBooked: false,
      isAdminApproved: true,
      $or: [{ isDeleted: false }, { isDeleted: "false" }],
    };

    if (city) {
      query.district = { $regex: `^${city}$`, $options: "i" };
    }

    const vehicles = await vehicle.find(query);

    return res.status(200).json(vehicles || []);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

// show one vehicle detail to user
export const showVehicleDetails = async (req, res, next) => {
  try {
    if (!req.body || !req.body.id) {
      return next(errorHandler(400, "vehicle id is required"));
    }

    const { id } = req.body;
    const vehicleDetail = await vehicle.findById(id);

    if (!vehicleDetail) {
      return next(errorHandler(404, "no vehicles found"));
    }

    return res.status(200).json(vehicleDetail);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

// check vehicle availability
export const checkAvailability = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(errorHandler(400, "bad request no body"));
    }

    const { pickupDate, dropOffDate, vehicleId } = req.body;

    if (!pickupDate || !dropOffDate || !vehicleId) {
      return next(
        errorHandler(409, "pickupDate, dropOffDate and vehicleId are required")
      );
    }

    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropOffDate);

    if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
      return next(errorHandler(400, "invalid date format"));
    }

    if (pickup >= dropoff) {
      return next(errorHandler(409, "invalid date range"));
    }

    const existingBookings = await Booking.find({
      vehicleId,
      pickupDate: { $lt: dropoff },
      dropOffDate: { $gt: pickup },
    });

    if (existingBookings.length > 0) {
      return next(
        errorHandler(
          400,
          "Vehicle is not available for the specified time period"
        )
      );
    }

    return res.status(200).json({
      message: "Vehicle is available for booking",
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in checkAvailability"));
  }
};

// search car filter in homepage
export const searchCar = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "please provide all the details" });
    }

    const {
      pickup_district,
      pickup_location,
      dropoff_location,
      pickuptime,
      dropofftime,
    } = req.body;

    if (
      !pickup_district ||
      !pickup_location ||
      !dropoff_location ||
      !pickuptime ||
      !dropofftime
    ) {
      return next(errorHandler(400, "please provide all the details"));
    }

    const pickupRaw = pickuptime?.$d || pickuptime;
    const dropoffRaw = dropofftime?.$d || dropofftime;

    const pickupDate = new Date(pickupRaw);
    const dropoffDate = new Date(dropoffRaw);

    if (
      Number.isNaN(pickupDate.getTime()) ||
      Number.isNaN(dropoffDate.getTime())
    ) {
      return next(errorHandler(400, "invalid date format"));
    }

    const dateDifferenceInMilliseconds =
      dropoffDate.getTime() - pickupDate.getTime();
    const dateDifferenceInDays =
      dateDifferenceInMilliseconds / (1000 * 60 * 60 * 24);

    if (dropoffDate <= pickupDate || dateDifferenceInDays < 1) {
      return next(errorHandler(401, "dropoff date should be larger"));
    }

    const search = await vehicle.aggregate([
      {
        $match: {
          district: pickup_district,
          location: pickup_location,
          isAdminApproved: true,
          $or: [{ isDeleted: false }, { isDeleted: "false" }],
          $or: [{ isBooked: false }, { isBooked: "false" }],
        },
      },
      {
        $group: {
          _id: {
            model: "$model",
            location: "$location",
            fuel_type: "$fuel_type",
            transmition: "$transmition",
            seats: "$seats",
          },
          vehicles: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $project: {
          _id: 1,
          vehicles: {
            $cond: {
              if: { $gt: [{ $size: "$vehicles" }, 1] },
              then: { $arrayElemAt: ["$vehicles", 0] },
              else: { $arrayElemAt: ["$vehicles", 0] },
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$vehicles",
        },
      },
    ]);

    return res.status(200).json(search || []);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong while searching car"));
  }
};