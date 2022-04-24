import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";
import debug, { IDebugger } from "debug";
const log: IDebugger = debug("middleware:JWT");
const JWT_KEY = config.Token.TOKEN_SECRET;
class JWT {
  authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader !== "null") {
      // const token = authHeader.split(" ")[1];
      console.log(authHeader)
      log("auth Header", JWT_KEY);
      jwt.verify(authHeader, JWT_KEY, (err: any, user: any) => {
        if (err) {
          log("Error", err);
          return res
            .status(403)
            .send({ success: false, message: "Token Expired" });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(403).json({ success: false, message: "UnAuthorized" });
    }
  }
}
export default new JWT();