import mongoose, { Document, Schema} from "mongoose";
export interface ICamera_IMG
{
    Date_Time : string,
    Camera_ID : string,
    Img: Array<string>
}
export interface ICameraIMG_Model extends ICamera_IMG,Document{}
const Camera_IMGModel: Schema = new Schema(
    {
        Date_Time:String,
        Camera_ID:String,
        Img:[String]
    }
)
export default mongoose.model<ICameraIMG_Model>('Camera_IMG',Camera_IMGModel);