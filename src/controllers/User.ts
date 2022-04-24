import { NextFunction, Request, response, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { any } from "joi";

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const Register = (req: Request, res: Response, next: NextFunction) => {
  const Name: string = req.body.User_Name;
  const Phone: string = req.body.User_Phone;
  const Email: string = req.body.User_Email;
  let Password: string = "";
  bcrypt.hash(req.body.User_Password, 10).then((r) => {
    Password = r;
    const Regisuser = new User({
      User_Name: Name,
      User_Phone: Phone,
      User_Email: Email,
      User_Password: Password,
    });
    console.log(Regisuser);
    const token = jwt.sign(
      { User_id: Email, Name },
      config.Token.TOKEN_SECRET,
      { expiresIn: "30d" }
    );
    console.log(token);
    return User.find({ User_Name: Name })
      .count(function (err, number) {
        if (number == 0) {
          console.log("notfoundcheckuser");
          User.findOne({ User_Email: Email }).count(function (err, Number) {
            if (Number == 0) {
              Regisuser.save()
                .then((Newuser) => res.status(201).json({ Token: token }))
                .catch((error) => res.status(500).json({ error }));
            } else {
              res.status(500).json({ message: "Email already exists" });
            }
          });
        } else if (number != 0) {
          res.status(500).json({ message: "Username already exists" });
        } else {
          User.findOne({ User_Email: Email })
            .count(function (err, num) {
              if (num == 0) {
                Regisuser.save()
                  .then((Newuser) => res.status(201).json({ Token: token }))
                  .catch((error) => res.status(500).json({ error }));
              } else {
                res.status(500).json({ message: "Email already exists" });
              }
            })
            .clone();
        }
      })
      .clone();
  });
};
const Login = (req: Request, res: Response, next: NextFunction) => {
  const Email: string = req.body.User_Email;
  const Password: string = req.body.User_Password;
  return User.findOne({ User_Email: Email }).count(function (err, num) {
    if (num == 0) {
      res.json({ message: "Email Wrong!!" });
    } else {
      console.log("found");
      User.findOne({ User_Password: bcrypt.hash(Password, 10) }).count(
        function (err, num) {
          if (num == 0) {
            res.json({ message: "Password not corrct" });
          } else {
            const token = jwt.sign(
              { User_id: Email },
              config.Token.TOKEN_SECRET,
              { expiresIn: "30d" }
            );
            console.log(token);
            res.json({ message: "Login Success!!", Token: token });
          }
        }
      );
    }
  });
};
const forgetpassword = (req: Request, res: Response, next: NextFunction) => {
  const CLIENT_ID =
    "901872679791-l5ssb10p617vt6mo4q2b3u61dgn4tt2u.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN =
    "1//04zNGhLAs-v8TCgYIARAAGAQSNwF-L9IrFX06Q5U84zMDsJS96vmstZePoN1JU3lsggqqBP5k5XHJyRXCnRARjqlPU32bXoNPMWw";

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    REFRESH_TOKEN
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  console.log(req.body.User_Email);
  const Email: string = req.body.User_Email;
  return User.findOne({ User_Email: Email }).count(async function (err, num) {
    if (num == 0) {
      res.json({ message: "Email Wrong!!" });
    } else {
      const token = jwt.sign({ User_id: Email }, config.Token.TOKEN_SECRET, {
        expiresIn: "5m",
      });
      try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "beebacorporation@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });
        const mailOptions = {
          from: "beebacorporation <beebacorporation@gmail.com>",
          to: Email,
          subject: "มีการขอรีเซ็ตรหัสผ่านด้วยอีเมลของคุณ",
          html: `
			<html>
    <head>
        <title>Reset Password</title>
        <meta charset="UTF-8">
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
        *{
font-family: "Kanit", sans-serif;
        }
    </style>
    </head>
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">




    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: "Open Sans", sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="" title="logo" target="_blank">
                            <img width="160" src="https://cdn.discordapp.com/attachments/764897423666446366/967500127558316092/unknown.png" title="logo" alt="logo">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:"Rubik",sans-serif;">
                                            รีเซ็ตรหัสผ่าน
                                            </h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            มีการขอรีเซ็ตรหัสผ่านด้วยอีเมลของคุณ กดปุ่มเพื่อรีทำการรีเซ็ตรหัสผ่านใหม่
                                        </p>
                                        <a href="http://localhost:9090/User/resetpassword/${token}" style="border:none;cursor:pointer;background:#FF9190;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:20px;padding:10px 24px;display:inline-block;border-radius:50px;text-align:center;">รีเซ็ตรหัสผ่าน</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>

                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`,
        };
        await transport
          .sendMail(mailOptions)
          .then(res.json({ message: "Email is sent please check you Email" }));
      } catch (error) {
        res.json({ message: `${error}` });
      }
    }
  });
};
const readUser = (req: Request, res: Response, next: NextFunction) => {
  return User.find()
    .then((Getuser) => res.status(201).json({ Getuser }))
    .catch((error) => res.status(500).json({ error }));
};
const getUserDataByEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const wantdata = {
    User_Email: req.params.Email,
  };
  return User.findOne(wantdata)
    .then((user) => res.status(200).json({ user }))
    .catch((error) => res.status(500).json({ error }));
};
const tokensendemail = (req: Request, res: Response, next: NextFunction) => {
  jwt.verify(
    req.params.token,
    config.Token.TOKEN_SECRET,
    (err: any, user: any) => {
      if (err) {
        console.log("tokeneex");
        res.render("tokenex");
      } else {
        res.render("resetpassword", { error: "" });
        console.log(req.body.password);
      }
    }
  );
};
const keepresetpassword = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.password);
  console.log(req.body.confirmpassword);
  const password: string = req.body.password;
  const confirmpassword: string = req.body.confirmpassword;
  const Userid: any = jwt.verify(req.params.token, config.Token.TOKEN_SECRET);
  if (password.length < 6) {
    return res.render("resetpassword", {
      error: "รหัสผ่านต้องไม่ต่ำกว่า 6 ตัวอักษร",
    });
  } else if (password === confirmpassword) {
    const password = bcrypt.hash(req.body.password, 10).then((hashpassword) => {
      const encriptpassword = {
        User_Password: hashpassword,
      };
      const findUser = {
        User_Email: Userid.User_id,
      };
      User.findOne(findUser).then((user) => {
        user!.set(encriptpassword);
        user?.save().then(() => {
          res.render("success", { error: "รีเซตรหัสผ่านแล้ว!!" });
        });
      });
    });
  } else {
    return res.render("resetpassword", { error: "ใส่รหัสผ่านไม่ตรงกัน!!" });
  }
};
export default {
  Register,
  Login,
  readUser,
  getUserDataByEmail,
  forgetpassword,
  tokensendemail,
  keepresetpassword,
};
