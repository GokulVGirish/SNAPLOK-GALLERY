import { Types } from "mongoose"
import { MulterFile } from "../rules/multerFIle"
import { Image } from "../rules/user"
import { Type } from "@aws-sdk/client-s3";

interface IPhotoManagementInteractor {
  uploadPhotos(email: string, files: MulterFile[]): Promise<boolean>;
  fetchPhotos(
    userId: Types.ObjectId
  ): Promise<{ success: boolean; images?: Image[]; message: string }>;
  changePhotoOrder(userId: Types.ObjectId,imageOrder:{_id:Types.ObjectId,orderIndex:number}[]): Promise<boolean>;
   photoTitleEdit(userId:Types.ObjectId,imageId:string,newTitle:string):Promise<boolean>
   deletePhotos(userId:Types.ObjectId,imageIds:Types.ObjectId[]):Promise<boolean>
}
export default IPhotoManagementInteractor