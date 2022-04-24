import express from 'express'
import controller from '../controllers/Camera_IMG'
import JWT from "../middleware/Auth";
const router = express.Router();

router.post("/uploadIMG/:Name",JWT.authenticateJWT,controller.uploadIMG);
router.get('/getAllIMG',controller.readALLIMG);
router.get('/getIMG/:Name/:DateTime/',controller.readByDateAndID);
router.get('/getIMG/:Name',JWT.authenticateJWT,controller.readByID)
router.delete("/deleteIMG/:Name/:DateTime/",JWT.authenticateJWT,controller.deleteByDateAndID);
router.delete('/deleteAllIMG',controller.deleteALLIMG);
export default router;