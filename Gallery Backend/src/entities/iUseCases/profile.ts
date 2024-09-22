import { Types } from "mongoose"
import { User } from "../rules/user"
import { MulterFile } from "../rules/multerFIle"
interface IProfileInteractors{
    getProfile(userId:Types.ObjectId):Promise<{success:boolean,user?:User,message:string}>
    updateProfile(userId:Types.ObjectId,name:string):Promise<boolean>
    updateProfilePicture(userId:Types.ObjectId,image:MulterFile):Promise<{status:boolean,message:string,url?:string}>
}
export default IProfileInteractors