import express from "express";
import {
    getStates,
    getCitiesByState,
    getVehicles,
} from "../controllers/userControllers/locationController.js";

const router = express.Router();

router.get("/states", getStates);
router.get("/cities/:state", getCitiesByState);
router.get("/vehicles", getVehicles);

export default router;