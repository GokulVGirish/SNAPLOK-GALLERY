"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema_1 = __importDefault(require("../../frameworks/mongoose/models/otpSchema"));
const userSchema_1 = __importDefault(require("../../frameworks/mongoose/models/userSchema"));
class Repository {
    async createOtpUser(userData) {
        try {
            const result = await otpSchema_1.default.create({
                name: userData.name,
                password: userData.password,
                email: userData.email,
                otp: userData.otp,
                otpExpires: new Date(Date.now() + 2 * 60 * 1000),
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async getOtpUser(email) {
        try {
            const result = await otpSchema_1.default.findOne({ email: email });
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async userExist(email) {
        try {
            const user = await userSchema_1.default.findOne({ email: email });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async createUser(data) {
        try {
            const user = await userSchema_1.default.create({
                name: data.name,
                email: data.email,
                password: data.password,
            });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async photoUpload(email, images = []) {
        try {
            const result = await userSchema_1.default.updateOne({ email: email }, { $push: { images: { $each: images } } });
            return result.modifiedCount > 0;
        }
        catch (error) {
            throw error;
        }
    }
    async fetchPhotos(userId) {
        try {
            const photos = await userSchema_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(userId),
                    },
                },
                {
                    $unwind: "$images",
                },
                {
                    $project: {
                        _id: "$images._id",
                        imagePath: "$images.imagePath",
                        title: "$images.title",
                        orderIndex: "$images.orderIndex",
                        createdAt: "$images.createdAt"
                    },
                },
                {
                    $sort: {
                        orderIndex: 1
                    }
                }
            ]);
            return photos;
        }
        catch (error) {
            throw error;
        }
    }
    async changePhotoOrder(userId, imageOrder) {
        try {
            const updatePromise = imageOrder?.map(async (img) => {
                return await userSchema_1.default.findOneAndUpdate({ _id: userId }, { $set: { "images.$[img].orderIndex": img.orderIndex } }, {
                    arrayFilters: [{ "img._id": img._id }],
                });
            });
            await Promise.all(updatePromise);
        }
        catch (error) {
            throw error;
        }
    }
    async photoTitleEdit(userId, imageId, newTitle) {
        try {
            const result = await userSchema_1.default.updateOne({ _id: userId }, { $set: { "images.$[img].title": newTitle } }, { arrayFilters: [{ "img._id": imageId }] });
            return result.modifiedCount > 0;
        }
        catch (error) {
            throw error;
        }
    }
    async getProfile(userId) {
        try {
            const profileDetails = await userSchema_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(userId)
                    }
                },
                {
                    $set: {
                        profilePhoto: { $ifNull: ["$profilePhoto", ""] }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        email: 1,
                        profilePhoto: 1
                    }
                }
            ]);
            return profileDetails[0];
        }
        catch (error) {
            throw error;
        }
    }
    async updateProfile(userId, name) {
        try {
            const result = await userSchema_1.default.updateOne({ _id: userId }, { $set: { name: name } });
            return result.modifiedCount > 0;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Repository;
