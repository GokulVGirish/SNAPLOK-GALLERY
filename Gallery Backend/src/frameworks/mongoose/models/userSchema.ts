import mongoose from "mongoose";
import { User } from "../../../entities/rules/user";

const imageSchema = new mongoose.Schema({
  imagePath: String,
  title: String,
  orderIndex: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: null },
  images: {
    type:[imageSchema],
    default:[]
  }
});
imageSchema.index({ orderIndex: 1 });
const userModel = mongoose.model("User", userSchema);
export default userModel;
