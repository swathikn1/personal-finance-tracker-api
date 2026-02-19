import { Router } from "express";
import { AuthContoller} from "../controller/AuthController";

const router = Router();

router.post("/register", AuthContoller.register);
router.post("/login", AuthContoller.login);

export default router;