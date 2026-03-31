import mongoose from "mongoose";
import Vehicle from "./models/vehicleModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const v = {
        registeration_number: "KL-05-AB-1234",
        company: "Skoda",
        name: "Kushaq MT",
        model: "SKODA KUSHAQ Petrol MT",
        car_title: "Sporty Premium SUV",
        car_description: "Great for weekend getaways.",
        year_made: 2022,
        fuel_type: "petrol",
        seats: 5,
        transmition: "manual",
        location: "ettumanoor : skoda service",
        district: "Kottayam",
        price: 4000,
        base_package: "24",
        car_type: "suv",
        image: ["https://imgd.aeplcdn.com/664x374/n/cw/ec/145021/kushaq-exterior-right-front-three-quarter-12.jpeg?isig=0&q=80"],
        isDeleted: "false",
        addedBy: "admin"
    };

    try {
      await Vehicle.insertMany([v]);
      console.log("Added car to Kottayam!");
    } catch (e) {
      console.log("Error inserting:", e);
    }
    mongoose.disconnect();
  })
  .catch(err => console.log(err));
