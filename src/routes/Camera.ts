import express from "express";
import controller from "../controllers/Camera";
import JWT from "../middleware/Auth";
const router = express.Router();
router.get("/ReadCamera/:Owner",JWT.authenticateJWT,controller.readCameraDataByOwner);
router.post("/SetupCamera/:Name",JWT.authenticateJWT, controller.setupCamera);
router.patch("/SensorCamera/:Name",JWT.authenticateJWT,controller.setupCameraSensor);
router.patch("/ReadyCamera/:Name",JWT.authenticateJWT, controller.setupCameraReady);
router.patch("/OwnerCamera/:Name", JWT.authenticateJWT, controller.setupOwner);
router.patch("/NameCamera/:Name",JWT.authenticateJWT,controller.setupName);
router.patch("/ResetStatus",controller.resetCameraStatus)
router.delete("/ResetCamera/:Name",JWT.authenticateJWT,controller.resetCamera);
router.get("/Onrealtime/:Name",JWT.authenticateJWT,controller.onRealTime);
router.get("/Offrealtime/:Name",JWT.authenticateJWT,controller.offRealTime);
router.get("/OnSensor/:Name",JWT.authenticateJWT, controller.onSensor);
router.get("/OffSensor/:Name",JWT.authenticateJWT, controller.offSensor);
export default router;