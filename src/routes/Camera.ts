import express from "express";
import controller from "../controllers/Camera";

const router = express.Router();
router.get("/ReadCamera/:Owner",controller.readCameraDataByOwner);
router.post("/SetupCamera/:Name", controller.setupCamera);
router.patch("/SensorCamera/:Name",controller.setupCameraSensor);
router.patch("/ReadyCamera/:Name", controller.setupCameraReady);
router.patch("/OwnerCamera/:Name",controller.setupOwner);
router.patch("/NameCamera/:Name",controller.setupName);
router.patch("/ResetStatus",controller.resetCameraStatus)
router.delete("/ResetCamera/:Name", controller.resetCamera);
export default router;