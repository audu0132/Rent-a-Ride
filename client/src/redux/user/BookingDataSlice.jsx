import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pickup_district: "",
  pickup_location: "",
  dropoff_location: "",
  pickuptime: {},
  dropofftime: {},
  pickupDate: {},
  dropoffDate: {},
  selectedVehicle: "",
};

const bookingDataSlice = createSlice({
  name: "bookingData",
  initialState,
  reducers: {
    setSelectedData: (state, action) => {
      const {
        pickup_district,
        pickup_location,
        dropoff_location,
        dropofftime,
        pickuptime,
      } = action.payload;

      // Set pickup details
      state.pickup_district = pickup_district;
      state.pickup_location = pickup_location;

      // Set dropoff details
      state.dropoff_location = dropoff_location;

      // Set pickupDate and dropoffDate
      (state.pickupDate = {
        day: pickuptime.$D,
        month: pickuptime.$M,
        year: pickuptime.$y,
        humanReadable: pickuptime.$d,
      }),
        (state.dropoffDate = {
          day: dropofftime.$D,
          month: dropofftime.$M,
          year: dropofftime.$y,
          humanReadable: dropofftime.$d,
        });

      // Set pickuptime and dropofftime
      state.pickuptime = {
        hour: pickuptime.$H,
        minute: pickuptime.$m,
        seconds: pickuptime.$s,
        year: pickuptime.$y,
      };

      state.dropofftime = {
        hour: dropofftime.$H,
        minute: dropofftime.$m,
        seconds: dropofftime.$s,
        year: dropofftime.$y,
      };
    },
    setBasicBookingDetails: (state, action) => {
      const { pickupDate, dropoffDate, pickup_location } = action.payload;
      state.pickupDate = { humanReadable: pickupDate };
      state.dropoffDate = { humanReadable: dropoffDate };
      state.pickup_location = pickup_location;
      state.dropoff_location = pickup_location;
      state.pickup_district = "Local";
    }
  },
});

export const { setSelectedData, setBasicBookingDetails } = bookingDataSlice.actions;
export default bookingDataSlice.reducer;
