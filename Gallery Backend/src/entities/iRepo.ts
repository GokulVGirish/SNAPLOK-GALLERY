import { Types } from "mongoose";
import { Image, OtpUser, User } from "./rules/user";


interface IRepository {
  createOtpUser(userData: {
    name: string;
    email: string;
    password: string;
    otp: string;
  }): Promise<OtpUser>;
  userExist(email: string): Promise<User | null>;
  getOtpUser(email: string): Promise<OtpUser>;
  createUser(data: OtpUser): Promise<User>;
  photoUpload(
    email: string,
    images: { orderIndex: number; title: string; imagePath: string }[]
  ): Promise<boolean>;
  fetchPhotos(userId: Types.ObjectId): Promise<Image[]>;
  changePhotoOrder(
    userId: Types.ObjectId,
    imageOrder: { _id: Types.ObjectId; orderIndex: number }[]
  ): Promise<void>;
  photoTitleEdit(
    userId: Types.ObjectId,
    imageId: string,
    newTitle: string
  ): Promise<boolean>;
  getProfile(userId: Types.ObjectId): Promise<User>;
  updateProfile(userId: Types.ObjectId, name: string): Promise<boolean>;
  resetPassword(email: string, password: string): Promise<boolean>;
  updateProfilePicture(userId: Types.ObjectId, key: string): Promise<boolean>;
  findPhotos(
    userId: Types.ObjectId,
    imageIds: Types.ObjectId[]
  ): Promise<Image[]>;
  deletePhotos(
    userId: Types.ObjectId,
    imageIds: Types.ObjectId[]
  ): Promise<boolean>;
}
export default IRepository