import { NextFunction, Request, response, Response } from "express";
import User from "../models/User";

const Register = (req: Request,res: Response, next:
    NextFunction)=>{
        const Name:string = req.body.User_Name
        const Phone:string = req.body.User_Phone
        const Email:string = req.body.User_Email
        const Password:string = req.body.User_Password
         const Regisuser = new User(
        {
            User_Name:Name,
            User_Phone:Phone,
            User_Email: Email,
            User_Password: Password
        });
        console.log(req.body)
            return  User.find({'User_Name':Name}).count(function(err,number){
                if(number == 0){
                console.log("notfoundcheckuser")
                User.findOne({'User_Email':Email}).count(function(err,Number){
                    if(Number == 0){
                    return Regisuser.save().then((Newuser)=>res.status(201).json({Newuser})).catch((error)=>res.status(500).json({error}))                   
                     }
                    else{
                        res.json({message:'Email already exists'})
                    }
                })
                }
                else if(number != 0){
                    res.json({message:'Username already exists'})
                }
                else{
                    User.findOne({'User_Email':Email}).count(function(err,num){
                    if(num == 0){
                        return Regisuser.save().then((Newuser)=>res.status(201).json({Newuser})).catch((error)=>res.status(500).json({error}))                    
                    }
                    else{
                        res.json({message:'Email already exists'})
                    }
                })
                }
            })
    }
    const Login = (req: Request,res: Response, next:
    NextFunction)=>{
        const Email:string = req.body.User_Email
        const Password:string = req.body.User_Password
        return User.findOne({"User_Email":Email}).count(function(err,num){
            if(num == 0){
                res.json({message:'Email Wrong!!'})
            }
            else{
                console.log("found")
                User.findOne({'User_Password':Password}).count(function(err,num){
                    if(num == 0){
                         res.json({message:'Password not corrct'})
                    }
                    else{
                        res.json({message:'Login Success!!'})
                    }
                })
            }
        })

    }
const readUser = (req: Request, res: Response, next: NextFunction) => {
    return User.find().then((Getuser)=>res.status(201).json({Getuser})).catch((error)=>res.status(500).json({error}));
}
export default {
  Register,
  Login,
  readUser
};