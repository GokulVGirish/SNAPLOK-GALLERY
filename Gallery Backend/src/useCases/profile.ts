import { Types } from "mongoose";
import IRepository from "../entities/iRepo";
import IProfileInteractors from "../entities/iUseCases/profile";
import { User } from "../entities/rules/user";
import { MulterFile } from "../entities/rules/multerFIle";
import { IawsS3 } from "../entities/services/iawsS3";


class ProfileInteractors implements IProfileInteractors{
    constructor(private readonly Repository:IRepository,private readonly AwsS3:IawsS3){}
    async getProfile(userId: Types.ObjectId): Promise<{ success: boolean; user?: User; message: string; }> {
        try{
            const result=await this.Repository.getProfile(userId)
            if(result.profilePhoto){
                const command=this.AwsS3.getObjectCommandS3(result.profilePhoto)
                const url=await this.AwsS3.getSignedUrlS3(command,3600)
                result.profilePhoto=url
            }
            if(result) return {success:true,message:"Success",user:result}
            return {success:false,message:"Something Went Wrong"}

        }
        catch(error){
            throw error
        }
    }
    async updateProfile(userId: Types.ObjectId, name: string): Promise<boolean> {
        try{
            const response=await this.Repository.updateProfile(userId,name)
            return response

        }
        catch(error){
            throw error
        }
    }
    async updateProfilePicture(userId: Types.ObjectId, image: MulterFile): Promise<{ status: boolean; message: string;url?:string }> {
        try{
            const user=await this.Repository.getProfile(userId)
            if(user.profilePhoto){
                await this.AwsS3.deleteObjectCommandS3(user.profilePhoto)
            }
            const fileExtension=image.mimetype.split("/")[1]
            const key=`profilePhotos/${user.email}-profilePhoto${new Date()}.${fileExtension}`
            await this.AwsS3.putObjectCommandS3(key,image.buffer,image.mimetype)
            const result=await this.Repository.updateProfilePicture(userId,key)
            const command=this.AwsS3.getObjectCommandS3(key)
            const url=await this.AwsS3.getSignedUrlS3(command,3600)
            if(result)return {status:true,message:"Sucessfully Updated",url}
            return {status:false,message:"Something Went Wrong"}



        }
        catch(error){
            throw error
        }
    }
}
export default ProfileInteractors