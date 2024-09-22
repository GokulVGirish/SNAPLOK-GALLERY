import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./authentication";


const isVerified = async(req:Request,res:Response,next:NextFunction) => {
    try{

        const {isVerified}=(req as CustomRequest).user
        if(!isVerified) return res.status(401).json({message:"otp not verified"})
        next()
      

    }
    catch(error){
         return res.status(500).json({ message: "Internal server Error" });   

    }
};
export default isVerified
