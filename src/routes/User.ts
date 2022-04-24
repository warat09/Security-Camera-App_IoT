import express from "express";
import controller from "../controllers/User";
import JWT from "../middleware/Auth";
const router = express.Router();
router.post("/register", controller.Register);
router.get("/register", controller.readUser);
router.post("/", controller.Login);
router.get("/", controller.readUser);
router.post("/forgetpassword", controller.forgetpassword);
router.get("/forgetpassword", controller.readUser);
router.get(
  "/getprofile/:Email",
  JWT.authenticateJWT,
  controller.getUserDataByEmail
);
router.get("/resetpassword/:token", controller.tokensendemail);
router.post("/resetpassword/:token", controller.keepresetpassword);

export default router;
