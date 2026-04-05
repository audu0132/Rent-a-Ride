import mongoose from "mongoose";
import Vehicle from "./models/vehicleModel.js";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { availableAtDate } from "./services/checkAvailableVehicle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected...");
    
    // 1. Check if vehicles exist
    const vehicles = await Vehicle.find();
    console.log(`Total vehicles in DB: ${vehicles.length}`);
    for (const v of vehicles) {
      console.log(`- ${v.model} at ${v.district} / ${v.location}`);
    }

    // 2. Test the query
    const d1 = new Date();
    const d2 = new Date();
    d2.setDate(d2.getDate() + 2);

    const available = await availableAtDate.call(null, d1, d2);
    console.log(`Available at date: ${available.length}`);

    const pickUpDistrict = "Kochi";
    const pickUpLocation = "kalamassery : skoda service";

    const filtered = available.filter(
      (cur) =>
        cur.district === pickUpDistrict &&
        cur.location == pickUpLocation &&
        cur.isDeleted === "false"
    );
    console.log(`Filtered for Kochi: ${filtered.length}`);
    
    mongoose.disconnect();
  })
  .catch(err => console.log(err));
