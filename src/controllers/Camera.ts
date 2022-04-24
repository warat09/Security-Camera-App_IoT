import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Camara_IMG from "../models/Camara_IMG";
import Camera from "../models/Camera";
import MqttHandler from "../MQTT/Connect"
var MqttClient = new MqttHandler();
MqttClient.connect();
const setupCamera =  (req: Request, res: Response, next: NextFunction) => 
{
    const Frist_register = new Camera({
      Camera_ID: req.params.Name,
      Camera_Owner: "",
      Camera_Name: "",
      Camera_Ready: false,
      Camera_Sensor: false,
      Camera_IP: "",
      Camera_MQTT: "channels/1691393/publish/fields/field"+req.params.Name.toString()[(req.params.Name.toString().length)-1],
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
    return Camera.findOne(want_data).then((camera)=>res.status(200).json({camera})).catch((error)=>res.status(500).json({error}));
}
const readCameraDataByOwner = (req: Request, res: Response, next: NextFunction) =>
{
    const want_data = {
        Camera_Owner: req.params.Owner,
    };
    const resetdata = {
        Camera_Ready: false,
        Camera_Sensor: false,
    };
    Camera.find(want_data).then((camera) => {
        if (camera) {
            camera.forEach((cam) => {
               cam.set(resetdata);
               cam.save();
               MqttClient.sendMessage(cam.Camera_MQTT, "CameraReady");
            });
        }
    });
    // return Camera.find(want_data).then((camera) => {
    //     if (camera) {
    //         setTimeout(() => {
    //            res.status(201).json({camera});
    //         }, 2000);
    //     } 
    //     else {
    //         res.status(404).json({ message: "Not found!!" });
    //     }
    // });
    return setTimeout(() => {
        Camera.find(want_data).then((camera)=>
        {
            if(camera)
            {
                res.status(200).json({ camera });
            }
            else
            {
                res.status(404).json({ message: "Not found!!" });
            }
        })
    }, 2000);
    // return Camera.find(want_data).then((camera)=>res.status(200).json({camera})).catch((error)=>res.status(500).json({error}));
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
    console.log(req.body)
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
            if(camera.Camera_Owner==="")
            {
                camera.set(data);
                return camera.save().then((camera) => res.status(201).json({ camera })).catch((error) => res.status(500).json({ error }));
            }
            else
            {
                res.status(404).json({ message: "Not found!!" });
            }
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
                return cam.save()
            })
            res.status(201).json({camera})
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
    Camara_IMG.deleteMany(want_reset).then((IMG_DATA)=>
    {
        console.log(IMG_DATA);
    })
    return Camera.deleteMany(want_reset).then((IMG_DATA)=>(IMG_DATA ? res.status(201).json({IMG_DATA}):res.status(404).json({message:'Not found!!!'}))).catch((error)=>res.status(500).json({error}))
}
const onRealTime = (req: Request, res: Response, next: NextFunction) =>
{
    const want_data = {
        Camera_ID: req.params.Name,
    }
    let Result:any;
    Camera.findOne(want_data).then((Cam)=>{
        MqttClient.sendMessage(Cam!.Camera_MQTT, "CameraRealtimeOn");
        Result = Cam;
    })
    return setTimeout(()=>
    {
        if(Result!=null)
        {
            res.status(200).json({ Result });
        }
        else
        {
            res.status(404).json({message:"Not found!!"});
        }
    },2000);
}
const offRealTime = (req: Request, res: Response, next: NextFunction) =>
{
    const want_data = {
        Camera_ID: req.params.Name,
    }
    let Result:any;
    Camera.findOne(want_data).then((Cam) => {
        MqttClient.sendMessage(Cam!.Camera_MQTT, "CameraRealtimeOff");
        Result = Cam;
    });
    return setTimeout(()=>
    {
        if(Result!=null)
        {
            res.status(200).json({ Result });
        }
        else
        {
            res.status(404).json({message:"Not found!!"});
        }
    },2000);
}
const onSensor = (req: Request, res: Response, next: NextFunction) =>
{
    const want_data = {
        Camera_ID: req.params.Name,
    };
    let Result:any;
    Camera.findOne(want_data).then((Cam) => {
        MqttClient.sendMessage(Cam!.Camera_MQTT, "OnSensor");
        Result = Cam;
    });
    return setTimeout(()=>
    {
        console.log(Result)
        if(Result!=null)
        {
            res.status(200).json({ Result });
        }
        else
        {
            res.status(404).json({message:"Not found!!"});
        }
    },2000);
}
const offSensor = (req: Request, res: Response, next: NextFunction) => 
{
    const want_data = {
        Camera_ID: req.params.Name,
    };
    let Result: any;
        Camera.findOne(want_data).then((Cam) => {
        MqttClient.sendMessage(Cam!.Camera_MQTT, "OffSensor");
        Result = Cam;
    });
    return setTimeout(() => {
        if (Result != null) {
        res.status(200).json({ Result });
        } else {
        res.status(404).json({ message: "Not found!!" });
        }
    }, 2000);
};
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
  onRealTime,
  offRealTime,
  onSensor,
  offSensor,
};