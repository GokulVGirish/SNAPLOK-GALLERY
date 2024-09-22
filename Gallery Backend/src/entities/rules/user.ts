import { Document } from "mongoose";

export interface OtpUser extends Document {
  name: string;
  email: string;
  password: string;
  otp:string;
  otpExpires:Date;
}


export interface Image {
  createdAt: Date;
  imagePath?: string;
  title?: string;
  orderIndex?: number;
}

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  profilePhoto:string|null;
  images: Image[]|null; 
}
