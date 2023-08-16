import  express  from "express";
import { 
    registerAdmin,
    authUser,
    logoutAdmin,
} from "../controllers/adminController.js";


const router = express.Router()

router.post("/", registerAdmin)
router.post("/auth", authUser)
router.post("/logout", logoutAdmin)


export default router