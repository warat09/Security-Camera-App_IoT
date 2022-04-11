import express from "express";
import controller from "../controllers/User";

const router = express.Router();
router.post("/register", controller.Register);
router.get("/register", controller.readUser);
router.post("/", controller.Login);
router.get("/", controller.readUser);
router.get("/getprofile/:Email",controller.getUserDataByEmail);
export default router;
