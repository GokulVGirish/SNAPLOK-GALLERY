import { Types } from "mongoose";
import IRepository from "../entities/iRepo";
import IPhotoManagementInteractor from "../entities/iUseCases/iPhoto";
import { MulterFile } from "../entities/rules/multerFIle";
import { IawsS3 } from "../entities/services/iawsS3";
import { Image } from "../entities/rules/user";

class PhotoManagementInteractor implements IPhotoManagementInteractor {
  constructor(
    private readonly Repository: IRepository,
    private readonly AwsS3: IawsS3
  ) {}
  async uploadPhotos(email: string, files: MulterFile[]): Promise<boolean> {
    try {
      const keys: { orderIndex: number; title: string; imagePath: string }[] =
        [];
      const user = await this.Repository.userExist(email);
      if (!user) return false;
      const currentImgages = user?.images || [];
      const newOrderIndex = currentImgages.length;
      const uploadPromises = files.map(async (file, index) => {
        const extension = file.mimetype.split("/")[1];
        const filePath = `galleries/${email}-photos/${file.originalname}.${extension}`;

        keys.push({
          orderIndex: newOrderIndex + index,
          title: file.originalname,
          imagePath: filePath,
        });

        await this.AwsS3.putObjectCommandS3(
          filePath,
          file.buffer,
          file.mimetype
        );
      });
      await Promise.all(uploadPromises);
   
      const savedToDb = await this.Repository.photoUpload(email, keys);
      if (savedToDb) return true;
      return false;
    } catch (error) {
       
      throw error;
    }
  }
  async fetchPhotos(userId: Types.ObjectId): Promise<{ success: boolean; images?: Image[]; message: string; }> {
      try{
        const result=await this.Repository.fetchPhotos(userId)
        if(result.length==0) return {success:false,message:"No image found"}
        const signedImages = await Promise.all(
          result.map(async (image) => {
            const command = this.AwsS3.getObjectCommandS3(
              image.imagePath as string
            );
            const signedUrl = await this.AwsS3.getSignedUrlS3(command, 3600);
            return { ...image, imagePath: signedUrl }; 
          })
        );
        return {success:true,images:signedImages,message:"Success"}
        

      }
      catch(error){
        throw error
      }
  }
  async changePhotoOrder(userId: Types.ObjectId, imageOrder: { _id: Types.ObjectId; orderIndex: number; }[]): Promise<boolean> {
      try{
        await this.Repository.changePhotoOrder(userId,imageOrder)
        return true


      }
      catch(error){
        throw error
      }
  }
  async photoTitleEdit(userId:Types.ObjectId,imageId: string, newTitle: string): Promise<boolean> {
      try{
        const response=await this.Repository.photoTitleEdit(userId,imageId,newTitle)
        return response

      }
      catch(error){
        throw error
      }
  }
}
export default PhotoManagementInteractor;
