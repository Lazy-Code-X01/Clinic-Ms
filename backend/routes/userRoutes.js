import  express  from "express";
import { 
    registerUser,
    getUserDetails,
    getUserDetailsById,
    addDiagnosis,
    getUserDiagnoses,
    getDiagnosis
} from "../controllers/userControllers.js";


const router = express.Router()
router.get("/getDiagnosis", getDiagnosis)

router.post("/", registerUser)
router.get("/getUser", getUserDetails)
router.get("/:id", getUserDetailsById);
router.post("/:id/diagnoses", addDiagnosis); // Add the new route for adding a diagnosis
router.get("/:id/diagnoses", getUserDiagnoses); // Add the new route for getting user diagnoses

export default router