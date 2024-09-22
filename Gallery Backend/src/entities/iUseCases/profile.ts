import { Types } from "mongoose"
import { User } from "../rules/user"
interface IProfileInteractors{
    getProfile(userId:Types.ObjectId):Promise<{success:boolean,user?:User,message:string}>
    updateProfile(userId:Types.ObjectId,name:string):Promise<boolean>
}
export default IProfileInteractors