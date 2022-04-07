import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Camera from "../models/Camera";

const setupCamera =  (req: Request, res: Response, next: NextFunction) => 
{
    const Frist_register = new Camera({
        Camera_ID : req.params.Name,
        Camera_Owner:"",
        Camera_Name:"",
        Camera_Ready:false,
        Camera_Sensor:false
    });
    const want_create = {
        Camera_ID : req.params.Name
    };
    return Camera.findOne(want_create).then((result)=>{(result ? res.status(201).json({message:"Already created!!"}): 
    Frist_register.save().then((camera)=>res.status(201).json({camera})).catch((error)=>res.status(500).json({error})))}).catch((error)=>res.status(500).json({error}));
}
const readCameraData = (req: Request, res: Response, next: NextFunction) =>
{
    const want_data = {
        Camera_ID: req.params.Name,
    };
    return Camera.findOne(want_data).then((camera)=>res.status(201).json({camera})).catch((error)=>res.status(500).json({error}));
}
const readCameraDataByOwner = (req: Request, res: Response, next: NextFunction) =>
{
    const want_data = {
        Camera_Owner: req.params.Owner,
    };
    return Camera.findOne(want_data).then((camera)=>res.status(201).json({camera})).catch((error)=>res.status(500).json({error}));
}
const setupCameraSensor = (req: Request, res: Response, next: NextFunction) =>
{
    const data = req.body;
    const want_update = {
        Camera_ID: req.params.Name,
    };
    return  Camera.findOne(want_update).then((camera)=>{
        if(camera)
        {
            camera.set(data);
            return camera.save().then((camera)=>res.status(201).json({camera})).catch((error)=> res.status(500).json({error}))
        }
        else
        {
            res.status(404).json({message:"Not found!!"});
        }
    });
}
const setupCameraReady = (req: Request, res: Response, next: NextFunction) =>
{
    const data = req.body;
    const want_update = {
      Camera_ID: req.params.Name,
    };
    return Camera.findOne(want_update).then((camera) => {
        if (camera) {
            camera.set(data);
            return camera.save().then((camera) => res.status(201).json({ camera })).catch((error) => res.status(500).json({ error }));
        } 
        else 
        {
            res.status(404).json({ message: "Not found!!" });
        }
    });
}
const setupOwner = (req: Request, res: Response, next: NextFunction) =>
{
    const data = req.body;
    const want_update = {
        Camera_ID: req.params.Name,
    };
    return Camera.findOne(want_update).then((camera)=>
    {
        if(camera)
        {
            camera.set(data);
            return camera.save().then((camera) => res.status(201).json({ camera })).catch((error) => res.status(500).json({ error }));
        }
        else
        {
            res.status(404).json({ message: "Not found!!" });
        }
    })
}
const setupName = (req: Request, res: Response, next: NextFunction) =>
{
    const data = req.body;
    const want_update = {
        Camera_ID: req.params.Name,
    };
    return Camera.findOne(want_update).then((camera) =>
    {
        if (camera) 
        {
            camera.set(data);
            return camera.save().then((camera) => res.status(201).json({ camera })).catch((error) => res.status(500).json({ error }));
        } 
        else 
        {
            res.status(404).json({ message: "Not found!!" });
        }
    });
}
const resetCameraStatus = (req: Request, res: Response, next: NextFunction) =>
{
    const resetdata = {
        Camera_Ready: false,
        Camera_Sensor: false,
    };
    return Camera.find().then((camera) => {
        if (camera) {
            camera.forEach(cam=>{
                cam.set(resetdata);
                return cam
                  .save()
                  .then((camera) => res.status(201).json({ camera }))
                  .catch((error) => res.status(500).json({ error }));
            })
        }
        else
        {
            res.status(404).json({ message: "Not found!!" });
        }
    });
}
const resetCamera = (req: Request, res: Response, next: NextFunction) =>
{
    const want_reset = {
        Camera_ID: req.params.Name,
    };
    return Camera.deleteMany(want_reset).then((IMG_DATA)=>(IMG_DATA ? res.status(201).json({IMG_DATA}):res.status(404).json({message:'Not found!!!'}))).catch((error)=>res.status(500).json({error}))
}
export default {
  setupCameraSensor,
  setupCamera,
  setupOwner,
  resetCamera,
  setupCameraReady,
  readCameraData,
  readCameraDataByOwner,
  setupName,
  resetCameraStatus,
};