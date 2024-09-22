"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const imageSchema = new mongoose_1.default.Schema({
    imagePath: String,
    title: String,
    orderIndex: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, default: null },
    images: {
        type: [imageSchema],
        default: []
    }
});
imageSchema.index({ orderIndex: 1 });
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
