import express from 'express'
import controller from '../controllers/Camera_IMG'

const router = express.Router();

router.post("/uploadIMG/:Name", controller.uploadIMG);
router.get('/getAllIMG',controller.readALLIMG);
router.get('/getIMG/:Name/:DateTime/',controller.readByDateAndID)
router.delete("/daleteIMG/:Name/:DateTime/",controller.deleteALLIMG);
router.delete('/deleteAllIMG',controller.deleteALLIMG);
export default router;