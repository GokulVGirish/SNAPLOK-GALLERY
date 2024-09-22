import { NextFunction,Request,Response } from "express";
import IProfileInteractors from "../../entities/iUseCases/profile";
import { CustomRequest } from "../../frameworks/express/middlewares/authentication";


class ProfileControllers{
    constructor(private readonly Interactor:IProfileInteractors){}
    async getProfile(req:Request,res:Response,next:NextFunction){
        try{
            const userId=(req as CustomRequest).user.userId
            const response=await this.Interactor.getProfile(userId)
            if(response.success)return res.status(200).json({success:true,message:response.message,user:response.user})
                res.status(500).json({success:false,message:response.message})

        }
        catch(error){

        }

    }
    async updateProfile(req:Request,res:Response,next:NextFunction){
        try{
               const userId = (req as CustomRequest).user.userId;
               const response=await this.Interactor.updateProfile(userId,req.body.name)
               if(response) return res.status(200).json({success:true,message:"Sucessfully Updated"})
                res.status(500).json({success:false,message:"Unexpected Error"})
               

        }
        catch(error){
            next(error)
        }

    }

}
export default ProfileControllers