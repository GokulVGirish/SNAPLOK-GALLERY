"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PhotoManagementControllers {
    constructor(Interactor) {
        this.Interactor = Interactor;
    }
    async photoUpload(req, res, next) {
        try {
            const email = req.user.email;
            const response = await this.Interactor.uploadPhotos(email, req.files);
            if (response)
                return res
                    .status(201)
                    .json({ success: true, message: "Sucessfully Added" });
            res.status(500).json({ success: false, message: "Something Went Wrong" });
        }
        catch (error) {
            next(error);
        }
    }
    async getPhotos(req, res, next) {
        try {
            const userId = req.user.userId;
            const response = await this.Interactor.fetchPhotos(userId);
            if (response.success)
                return res.status(200).json({
                    success: true,
                    message: response.message,
                    images: response.images,
                });
            res.status(404).json({ success: false, message: response.message });
        }
        catch (error) {
            next(error);
        }
    }
    async changePhotosOrder(req, res, next) {
        try {
            const userId = req.user.userId;
            const response = await this.Interactor.changePhotoOrder(userId, req.body.images);
            if (response)
                res.status(200).json({ message: "Success" });
        }
        catch (error) {
            next(error);
        }
    }
    async photoTitleEdit(req, res, next) {
        try {
            const userId = req.user.userId;
            const imgId = req.params.imgId;
            const newTitle = req.body.title;
            const response = await this.Interactor.photoTitleEdit(userId, imgId, newTitle);
            if (response)
                return res.status(200).json({ success: true });
            res.status(500).json({ success: false });
        }
        catch (error) {
            next(error);
        }
    }
    async deletePhotos(req, res, next) {
        try {
            const userId = req.user.userId;
            const selectedImages = req.body;
            const response = await this.Interactor.deletePhotos(userId, selectedImages);
            if (response)
                return res.status(200).json({ success: true, message: "Sucessfully Deleted" });
            res.status(500).json({ success: false });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = PhotoManagementControllers;
