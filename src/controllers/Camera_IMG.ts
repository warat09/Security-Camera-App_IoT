import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Camera_IMG from "../models/Camara_IMG";
import admin from "firebase-admin"
import Camera from "../models/Camera";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
const serviceAccount = require("../Firebase_Service/iot-project-7d920-firebase-adminsdk-vlya4-26a5359c01.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
        "https://iot-project-7d920-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const uploadIMG = (req: Request, res: Response, next: NextFunction) => {
    const img:Array<String> =req.body.img; 
    const cameraname:String = req.params.Name;
    const ALL_date = new Date();
    let date = ("0" + ALL_date.getDate()).slice(-2);
    let month = ("0" + (ALL_date.getMonth() + 1)).slice(-2);
    let year = ALL_date.getFullYear();
    let hours = (ALL_date.getHours()<10?'0':'') + ALL_date.getHours() ;
    let minutes = (ALL_date.getMinutes() < 10 ? "0" : "") + ALL_date.getMinutes();
    let seconds = (ALL_date.getSeconds() < 10 ? "0" : "") + ALL_date.getSeconds();
    const camera_ID = new Camera_IMG(
        {
            Date_Time:year + "-" + month + "-" + date + "|" + hours + ":" + minutes + ":" + seconds,
            Camera_ID:cameraname,
            Img:img
        });
    const want_data = {
        Camera_ID:req.params.Name
    }
    Camera.findOne(want_data).then((result)=>{
        let message:any= {
            notification:{
                title : result?.Camera_Name,
                body : "วันที่ : " + date + "/" + month + "/" + year + "\nเวลา : "+ hours + ":" + minutes + ":" + seconds
            },
            topic: `${result!.Camera_Owner}`
        }
        admin.messaging().send(message).then((res)=>console.log(res))
    })
    return camera_ID.save().then((IMG)=>res.status(201).json({IMG})).catch((error)=>res.status(500).json({error}))
};
const readByID = (req: Request, res: Response, next: NextFunction) => {
    const want_data = {
        Camera_ID:req.params.Name
    }
    return Camera_IMG.find(want_data).then((IMG_DATA)=>{(IMG_DATA ? res.status(201).json({IMG_DATA}) : res.status(404).json({message: 'Not found!!'}))})
    .catch((error)=>res.status(500).json({error}));
}
const readALLIMG = (req: Request, res: Response, next: NextFunction) => {
    return Camera_IMG.find().then((IMG)=>res.status(201).json({IMG})).catch((error)=>res.status(500).json({error}));
}
const readByDateAndID = (req: Request, res: Response, next: NextFunction) => {
    const want_data = {
        Date_Time:req.params.DateTime,
        Camera_ID:req.params.Name,
    }
    return Camera_IMG.find(want_data).then((IMG_DATA)=>{(IMG_DATA ? res.status(201).json({IMG_DATA}) : res.status(404).json({message: 'Not found!!'}))})
    .catch((error)=>res.status(500).json({error}));
}

const deleteByDateAndID = (req: Request, res: Response, next: NextFunction)=>
{
    const want_data = {
        Date_Time: req.params.DateTime,
        Camera_ID: req.params.Name,
    };
    return Camera_IMG.deleteMany(want_data).then((IMG_DATA)=>(IMG_DATA ? res.status(201).json({IMG_DATA}) : res.status(404).json({message: 'Not found!!!'})))
    .catch((error)=>res.status(500).json({error}));
}

const deleteALLIMG = (req: Request, res: Response, next: NextFunction) => {
    const query = {Data_Time:{$regex:"[0-9]*"}}
    return Camera_IMG.deleteMany(query).then(()=>res.status(201).json({message:"DeleteALL"})).catch((error)=>res.status(500).json({error}))
} 

export default {uploadIMG,readALLIMG,deleteALLIMG,readByDateAndID,readByID,deleteByDateAndID};