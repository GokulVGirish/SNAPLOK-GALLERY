import { Types } from "mongoose";
import IRepository from "../entities/iRepo";
import IProfileInteractors from "../entities/iUseCases/profile";
import { User } from "../entities/rules/user";


class ProfileInteractors implements IProfileInteractors{
    constructor(private readonly Repository:IRepository){}
    async getProfile(userId: Types.ObjectId): Promise<{ success: boolean; user?: User; message: string; }> {
        try{
            const result=await this.Repository.getProfile(userId)
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
}
export default ProfileInteractors