import mongoose, { Types } from "mongoose";
import IRepository from "../../entities/iRepo";
import { Image, OtpUser, User } from "../../entities/rules/user";
import otpModel from "../../frameworks/mongoose/models/otpSchema";
import userModel from "../../frameworks/mongoose/models/userSchema";

class Repository implements IRepository {
  async createOtpUser(userData: {
    name: string;
    email: string;
    password: string;
    otp: string;
  }): Promise<OtpUser> {
    try {
      const result = await otpModel.create({
        name: userData.name,
        password: userData.password,
        email: userData.email,
        otp: userData.otp,
        otpExpires: new Date(Date.now() + 2 * 60 * 1000),
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getOtpUser(email: string): Promise<OtpUser> {
    try {
      const result = await otpModel.findOne({ email: email });
      return result;
    } catch (error) {
      throw error;
    }
  }
  async userExist(email: string): Promise<User | null> {
    try {
      const user = await userModel.findOne({ email: email });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async createUser(data: OtpUser): Promise<User> {
    try {
      const user = await userModel.create({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async photoUpload(
    email: string,
    images: { orderIndex: number; title: string; imagePath: string }[] = []
  ): Promise<boolean> {
    try {
      const result = await userModel.updateOne(
        { email: email },
        { $push: { images: { $each: images } } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }
  async fetchPhotos(userId: Types.ObjectId): Promise<Image[]> {
      try{
        const photos = await userModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $unwind: "$images",
          },
          {
            $project: {
               _id:"$images._id",
              imagePath: "$images.imagePath",
              title: "$images.title",
              orderIndex:"$images.orderIndex",
              createdAt:"$images.createdAt"

            },
          },
          {
            $sort:{
                orderIndex:1
            }
          }
        ]);
       return photos

      }
      catch(error){
        throw error
      }
  }
  async changePhotoOrder(userId: Types.ObjectId, imageOrder: { _id: Types.ObjectId; orderIndex: number; }[]): Promise<void> {
      try{
       
        const updatePromise=imageOrder?.map(async(img)=>{
             return await userModel.findOneAndUpdate(
               { _id: userId },
               { $set: { "images.$[img].orderIndex": img.orderIndex } },
               {
                 arrayFilters: [{ "img._id": img._id }], 
              
               }
             );
        })
         await Promise.all(updatePromise);

      }
      catch(error){
        throw error
      }
  }
  async photoTitleEdit(userId:Types.ObjectId,imageId: string, newTitle: string): Promise<boolean> {
      try{
        const result=await userModel.updateOne({_id:userId},{$set:{"images.$[img].title":newTitle}},{arrayFilters:[{"img._id":imageId}]})
        return result.modifiedCount>0

      }
      catch(error){
        throw error
      }
  }
  async getProfile(userId: Types.ObjectId): Promise<User> {
      try{
        const profileDetails=await userModel.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $set:{
                    profilePhoto:{$ifNull:["$profilePhoto",""]}
                }
            },
            {
                $project:{
                    _id:0,
                    name:1,
                    email:1,
                    profilePhoto:1
                }

            }
        ])
        
        return profileDetails[0]
       

      }
      catch(error){
        throw error
      }
  }
  async updateProfile(userId: Types.ObjectId, name: string): Promise<boolean> {
      try{
        const result=await userModel.updateOne({_id:userId},{$set:{name:name}})
        return result.modifiedCount>0

      }
      catch(error){
        throw error
      }
  }
}
export default Repository