import express from 'express'
import controller from '../controllers/Camera_IMG'

const router = express.Router();

router.post("/uploadIMG/:Name", controller.uploadIMG);
router.get('/getAllIMG',controller.readALLIMG);
router.get('/getIMG/:Name/:DateTime/',controller.readByDateAndID);
router.get('/getIMG/:Name',controller.readByID)
router.delete("/deleteIMG/:Name/:DateTime/",controller.deleteByDateAndID);
router.delete('/deleteAllIMG',controller.deleteALLIMG);
export default router;