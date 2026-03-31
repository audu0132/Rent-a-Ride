import mongoose from "mongoose";
import Vehicle from "./models/vehicleModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname (ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB for Seeding Vehicles...");

    const dummyVehicles = [
      {
        registeration_number: "KL-07-XY-9999",
        company: "Maruti Suzuki",
        name: "Alto 800 LXI",
        model: "Alto 800",
        car_title: "Reliable City Hatchback",
        car_description: "Perfect for city rides and narrow streets.",
        year_made: 2021,
        fuel_type: "petrol",
        seats: 4,
        transmition: "manual",
        location: "kalamassery : skoda service",
        district: "Kochi",
        price: 1500,
        base_package: "24",
        car_type: "hatchback",
        image: ["../client/src/Assets/booking-alto.png"],
        isDeleted: "false",
        addedBy: "admin"
      },
      {
        registeration_number: "KL-01-AB-1111",
        company: "Skoda",
        name: "Slavia AT",
        model: "SKODA SLAVIA PETROL AT",
        car_title: "Premium Sedan",
        car_description: "Comfortable and powerful sedan for long trips.",
        year_made: 2022,
        fuel_type: "petrol",
        seats: 5,
        transmition: "automatic",
        location: "Nh 66 bybass : kochuveli railway station",
        district: "Trivandrum",
        price: 3500,
        base_package: "24",
        car_type: "sedan",
        image: ["https://stimg.cardekho.com/images/carexteriorimages/630x420/Skoda/Slavia/11810/1762938173534/front-left-side-47.jpg?tr=w-664"],
        isDeleted: "false",
        addedBy: "admin"
      },
      {
        registeration_number: "KL-08-CC-5555",
        company: "MG",
        name: "Hector MT",
        model: "MG HECTOR Petrol MT",
        car_title: "Spacious SUV",
        car_description: "Large SUV for families.",
        year_made: 2023,
        fuel_type: "petrol",
        seats: 5,
        transmition: "manual",
        location: "thrissur : railway station",
        district: "Thrissur",
        price: 4500,
        base_package: "24",
        car_type: "suv",
        image: ["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"],
        isDeleted: "false",
        addedBy: "admin"
      }
    ];

    try {
      await Vehicle.insertMany(dummyVehicles);
      console.log("Dummy vehicles inserted successfully.");
    } catch (e) {
      console.log("Error inserting:", e);
    }

    mongoose.disconnect();
  })
  .catch(err => console.log(err));
