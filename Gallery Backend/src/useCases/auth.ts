import IRepository from "../entities/iRepo";
import IAuthInteractor from "../entities/iUseCases/iauth";
import { IMailer } from "../entities/services/iMailer";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { emit } from "process";


class AuthInteractor implements IAuthInteractor{
    constructor(private readonly Repository:IRepository,private readonly Mailer:IMailer){}
    async otpSignup(userData: { name: string; email: string; password: string; }): Promise<{ status: boolean; message: string; errorCode?: string;token?:string }> {
        try{
            const userExist=await this.Repository.userExist(userData.email)
            if(userExist) return {status:false,message:"User Already Exist",errorCode:"Already_Exist"}
            const sent=await this.Mailer.sendMail(userData.email)
            if(!sent.success) return {status:false,message:"Error sending otp",errorCode:"OTP_Send_Error"}
            const hashedPassword=await bcrypt.hash(userData.password,10)
            const otpUserCreate=await this.Repository.createOtpUser({...userData,otp:sent.otp,password:hashedPassword})
            if(!otpUserCreate) return {status:false,message:"Something Went Wrong",errorCode:"Server_Error"}
            const token = jwt.sign(
              {
                userId: otpUserCreate._id,
                email: userData.email,
                isVerified: false,
              },
              process.env.ACCESS_TOKEN_SECRET as string,
              { expiresIn: "10m" }
            );
            return {status:true,message:"Success",token:token}

        }
        catch(error){
            throw error
        }
    }
    async otpValidateSignup(email: string, otp: string): Promise<{ status: boolean; message: string; errorCode?: string;access?:string;refresh?:string }> {
        try{
            const otpUser=await this.Repository.getOtpUser(email)
            if(!otpUser)return {status:false,message:"Try Signing Up Again",errorCode:"Invalid_User"}
             if (otp!==otpUser.otp)  return {
                   status: false,
                   message: "Otp Expired",
                   errorCode: "Wrong",
                 };
               if (new Date() > otpUser.otpExpires)
                 return {
                   status: false,
                   message: "Otp Expired",
                   errorCode: "Expired",
                 };
           
            const user=await this.Repository.createUser(otpUser)
           const accessToken = jwt.sign(
             {
               userId: user._id,
               email: user.email,
               isVerified: true,
             },
             process.env.ACCESS_TOKEN_SECRET as string,
             { expiresIn: "1h" }
           );
           const refreshToken = jwt.sign(
             {
               userId: user._id,
               email: user.email,
               isVerified: true,
             },
             process.env.REFRESH_TOKEN_SECRET as string,
             { expiresIn: "1d" }
           );
           return {status:true,message:"Success",access:accessToken,refresh:refreshToken}

        }
        catch(error){
            throw error
        }
    }
    async Login(data: { email: string; password: string; }): Promise<{ status: boolean; message: string; errorCode?: string; access?: string; refresh?: string; }> {
        try{
            const userExist=await this.Repository.userExist(data.email)
            if(!userExist) return {status:false,message:"User not found",errorCode:"No_User"}
            const hashedPassword=userExist.password
            const isVerified=await bcrypt.compare(data.password,hashedPassword)
            if(!isVerified)return {status:false,message:"Wrong password",errorCode:"Wrong_Pass"}
            const accessToken = jwt.sign(
              {
                userId: userExist._id,
                email: userExist.email,
                isVerified: true,
              },
              process.env.ACCESS_TOKEN_SECRET as string,
              { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
              {
                userId: userExist._id,
                email: userExist.email,
                isVerified: true,
              },
              process.env.REFRESH_TOKEN_SECRET as string,
              { expiresIn: "1d" }
            );
            return {
              status: true,
              message: "Success",
              access: accessToken,
              refresh: refreshToken,
            };


        }
        catch(error){
            throw error
        }
    }
    

}
export default AuthInteractor