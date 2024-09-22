"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PhotoManagementInteractor {
    constructor(Repository, AwsS3) {
        this.Repository = Repository;
        this.AwsS3 = AwsS3;
    }
    async uploadPhotos(email, files) {
        try {
            const keys = [];
            const user = await this.Repository.userExist(email);
            if (!user)
                return false;
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
                await this.AwsS3.putObjectCommandS3(filePath, file.buffer, file.mimetype);
            });
            await Promise.all(uploadPromises);
            const savedToDb = await this.Repository.photoUpload(email, keys);
            if (savedToDb)
                return true;
            return false;
        }
        catch (error) {
            throw error;
        }
    }
    async fetchPhotos(userId) {
        try {
            const result = await this.Repository.fetchPhotos(userId);
            if (result.length == 0)
                return { success: false, message: "No image found" };
            const signedImages = await Promise.all(result.map(async (image) => {
                const command = this.AwsS3.getObjectCommandS3(image.imagePath);
                const signedUrl = await this.AwsS3.getSignedUrlS3(command, 3600);
                return { ...image, imagePath: signedUrl };
            }));
            return { success: true, images: signedImages, message: "Success" };
        }
        catch (error) {
            throw error;
        }
    }
    async changePhotoOrder(userId, imageOrder) {
        try {
            await this.Repository.changePhotoOrder(userId, imageOrder);
            return true;
        }
        catch (error) {
            throw error;
        }
    }
    async photoTitleEdit(userId, imageId, newTitle) {
        try {
            const response = await this.Repository.photoTitleEdit(userId, imageId, newTitle);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async deletePhotos(userId, imageIds) {
        try {
            const photos = await this.Repository.findPhotos(userId, imageIds);
            const deletedPromise = photos.map(async (img) => {
                return await this.AwsS3.deleteObjectCommandS3(img.imagePath);
            });
            await Promise.all(deletedPromise);
            const response = await this.Repository.deletePhotos(userId, imageIds);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = PhotoManagementInteractor;
