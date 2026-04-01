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
        image: [
          "https://imgd.aeplcdn.com/1056x594/n/2k6uesa_1463329.jpg",
          "https://imgd.aeplcdn.com/370x208/n/cw/ec/39013/alto-interior-rear-seats.jpeg?isig=0&q=80",
          "https://imgd.aeplcdn.com/370x208/n/cw/ec/39013/alto-interior-music-system.jpeg?isig=0&q=80",
          "https://imgd.aeplcdn.com/370x208/n/cw/ec/39013/alto-interior-dashboard.jpeg?isig=0&q=80"
        ],
        isDeleted: false,
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
        location: "Nh 66 bypass : kochuveli railway station",
        district: "Trivandrum",
        price: 3500,
        base_package: "24",
        car_type: "sedan",
        image: [
          "https://stimg.cardekho.com/images/carexteriorimages/630x420/Skoda/Slavia/11810/1762938173534/front-left-side-47.jpg",
          "https://stimg.cardekho.com/images/carinteriorimages/930x620/Skoda/Slavia/11810/1718796298770/dashboard-59.jpg?tr=w-420",
          "http://stimg.cardekho.com/images/carinteriorimages/930x620/Skoda/Slavia/11810/1749704105297/rear-seats-(turned-over)-115.jpg?tr=w-420",
          "https://stimg.cardekho.com/images/carinteriorimages/930x620/Skoda/Slavia/11811/1718796222425/sun-roof-moon-roof-81.jpg?tr=w-420"
        ],
        isDeleted: false,
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
        image: [
          "https://imgd.aeplcdn.com/1056x594/n/jo8keib_1894901.jpg?q=80",
          "https://imgd.aeplcdn.com/370x208/n/cw/ec/212881/hector-facelift-interior-front-row-seats-10.jpeg?isig=0&q=80",
          "https://imgd.aeplcdn.com/370x208/n/cw/ec/212881/hector-facelift-interior-front-row-seats.jpeg?isig=0&q=80",
          "https://imgd.aeplcdn.com/370x208/n/cw/ec/212881/hector-facelift-interior-bootspace.jpeg?isig=0&q=80"
        ],
        isDeleted: false,
        addedBy: "admin"
      },
  // 🔵 Maharashtra
  {
    registeration_number: "MH-12-AB-1234",
    company: "Tata",
    name: "Nexon",
    model: "Nexon EV",
    car_title: "Electric SUV",
    car_description: "Eco-friendly electric SUV.",
    year_made: 2023,
    fuel_type: "electric",
    seats: 5,
    transmition: "automatic",
    location: "Hinjewadi Phase 1",
    district: "Pune",
    price: 3000,
    base_package: "24",
    car_type: "suv",
    image: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/41645/tata-nexon-right-front-three-quarter3.jpeg?q=80",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/41564/creta-interior-dashboard.jpeg?q=80",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/41564/creta-interior-dashboard.jpeg?q=80",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/41564/creta-interior-dashboard.jpeg?q=80",
    ],
    isDeleted: false,
    addedBy: "admin"
  },

  {
    registeration_number: "MH-01-CD-5678",
    company: "Hyundai",
    name: "Creta",
    model: "Creta SX",
    car_title: "Popular SUV",
    car_description: "Comfortable SUV for family trips.",
    year_made: 2022,
    fuel_type: "petrol",
    seats: 5,
    transmition: "manual",
    location: "Andheri West",
    district: "Mumbai",
    price: 3500,
    base_package: "24",
    car_type: "suv",
    image: [
      "https://imgd.aeplcdn.com/1056x594/n/cw/ec/106815/creta-exterior-right-front-three-quarter.jpeg",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/41564/creta-interior-dashboard.jpeg?q=80",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/41564/creta-interior-dashboard.jpeg?q=80",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/41564/creta-interior-dashboard.jpeg?q=80",
    ],
    isDeleted: false,
    addedBy: "admin"
  },
  {
    registeration_number: "MH-14-CD-5678",
    company: "Suzuki",
    name: "Baleno",
    model: "Baleno Alpha",
    car_title: "Popular Hatchback",
    car_description: "Comfortable Hatchback for family trips.",
    year_made: 2023,
    fuel_type: "petrol",
    seats: 5,
    transmition: "manual",
    location: "Pimpri Chinchwad",
    district: "Pune",
    price: 3500,
    base_package: "24",
    car_type: "hatchback",
    image: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-69.png?isig=0&q=80",
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-69.png?isig=0&q=80",
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-69.png?isig=0&q=80",
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-69.png?isig=0&q=80",
    ],
    isDeleted: false,
    addedBy: "admin"
  },

  // 🔵 Karnataka
  {
    registeration_number: "KA-03-EF-9999",
    company: "Honda",
    name: "City",
    model: "Honda City ZX",
    car_title: "Premium Sedan",
    car_description: "Smooth driving experience.",
    year_made: 2021,
    fuel_type: "petrol",
    seats: 5,
    transmition: "automatic",
    location: "Whitefield",
    district: "Bangalore",
    price: 2800,
    base_package: "24",
    car_type: "sedan",
    image: [
      "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/12093/1755764990493/front-left-side-47.jpg",
      "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/12093/1755764990493/front-left-side-47.jpg",
      "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/12093/1755764990493/front-left-side-47.jpg",
      "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/12093/1755764990493/front-left-side-47.jpg",
    ],
    isDeleted: false,
    addedBy: "admin"
  },

  // 🔵 Delhi
  {
    registeration_number: "DL-01-GH-2222",
    company: "Toyota",
    name: "Innova Crysta",
    model: "Crysta ZX",
    car_title: "Family MPV",
    car_description: "Best for long family trips.",
    year_made: 2022,
    fuel_type: "diesel",
    seats: 7,
    transmition: "manual",
    location: "Connaught Place",
    district: "Delhi",
    price: 5000,
    base_package: "24",
    car_type: "mpv",
    image: [
      "https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Innova-Crysta/9608/1755846139274/front-left-side-47.jpg",
      "https://stimg.cardekho.com/images/carinteriorimages/930x620/Toyota/Innova-Crysta/9612/1680599876791/airbags-94.jpg?tr=w-420",
      "https://stimg.cardekho.com/images/carinteriorimages/930x620/Toyota/Innova-Crysta/9612/1680599876791/steering-wheel-54.jpg?tr=w-420",
      "https://stimg.cardekho.com/images/carinteriorimages/930x620/Toyota/Innova-Crysta/9612/1680599876791/rear-view-mirror-courtesy-lamps-64.jpg?tr=w-420",
      
    ],
    isDeleted: false,
    addedBy: "admin"
  },

  // 🔵 Gujarat
  {
    registeration_number: "GJ-05-IJ-3333",
    company: "Maruti Suzuki",
    name: "Swift",
    model: "Swift VXI",
    car_title: "Compact Hatchback",
    car_description: "Budget-friendly city car.",
    year_made: 2020,
    fuel_type: "petrol",
    seats: 5,
    transmition: "manual",
    location: "Navrangpura",
    district: "Ahmedabad",
    price: 1800,
    base_package: "24",
    car_type: "hatchback",
    image: [
      "https://imgd.aeplcdn.com/1056x594/n/cw/ec/159099/swift-exterior-right-front-three-quarter.jpeg",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/159099/swift-interior-steering-wheel.jpeg?isig=0&q=80",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/159099/swift-interior-front-row-seats.jpeg?isig=0&q=80",
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/184849/maruti-suzuki-swift-bootspace3.jpeg?isig=0&q=80",
    ],
    isDeleted: false,
    addedBy: "admin"
  },

  // 🔵 Tamil Nadu
  {
    registeration_number: "TN-10-KL-4444",
    company: "Kia",
    name: "Seltos",
    model: "Seltos GTX",
    car_title: "Stylish SUV",
    car_description: "Feature-loaded SUV.",
    year_made: 2023,
    fuel_type: "petrol",
    seats: 5,
    transmition: "automatic",
    location: "T Nagar",
    district: "Chennai",
    price: 3200,
    base_package: "24",
    car_type: "suv",
    image: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/135051/seltos-exterior-right-front-three-quarter-31.jpeg?isig=0&q=80",
    
    ],
    isDeleted: false,
    addedBy: "admin"
  },

  // 🔵 Telangana
  {
    registeration_number: "TS-09-MN-5555",
    company: "Mahindra",
    name: "Thar",
    model: "Thar 4x4",
    car_title: "Offroad SUV",
    car_description: "Best for adventure trips.",
    year_made: 2022,
    fuel_type: "diesel",
    seats: 4,
    transmition: "manual",
    location: "Banjara Hills",
    district: "Hyderabad",
    price: 4000,
    base_package: "24",
    car_type: "suv",
    image: [
      "https://imgd.aeplcdn.com/1056x594/n/oquamhb_1877457.jpg?q=80",
    
    ],
    isDeleted: false,
    addedBy: "admin"
  }
];

    try {
      await Vehicle.deleteMany();   // clear old data
      await Vehicle.insertMany(dummyVehicles);

      console.log("Dummy vehicles inserted successfully.");
    } catch (e) {
      console.log("Error inserting:", e);
    }


    mongoose.disconnect();
  })
  .catch(err => console.log(err));

