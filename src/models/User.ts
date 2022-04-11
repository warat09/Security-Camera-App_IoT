import mongoose, { Document, Schema } from "mongoose";
export interface IUser {
  User_Name: string;
  User_Phone: string;
  User_Email: string;
  User_Password: string;
}
export interface IUser_Model extends IUser, Document {}

const UserModel: Schema = new Schema({
  User_Name: String,
  User_Phone: String,
  User_Email: String,
  User_Password: String,
});

export default mongoose.model<IUser_Model>("User", UserModel);
