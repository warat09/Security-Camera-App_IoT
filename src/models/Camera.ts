import mongoose, { Document, Schema} from "mongoose";
export interface ICamera {  
  Camera_ID: string;
  Camera_Name:string;
  Camera_Owner: string;
  Camera_Ready: boolean;
  Camera_Sensor: boolean;
}
export interface ICamera_Model extends ICamera,Document{}

const CameraModel: Schema = new Schema(
    {
        Camera_ID:String,
        Camera_Name:String,
        Camera_Ready:Boolean,
        Camera_Sensor:Boolean,
        Camera_Owner:String
    }
)
export default mongoose.model<ICamera_Model>('Camera',CameraModel);