import express from "express";
import controller from "../controllers/User";

const router = express.Router();

router.post("/register", controller.Register);
router.get("/register",controller.readUser);

router.post("/", controller.Login);
router.get("/",controller.readUser);



export default router