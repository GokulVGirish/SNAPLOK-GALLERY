"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProfileControllers {
    constructor(Interactor) {
        this.Interactor = Interactor;
    }
    async getProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const response = await this.Interactor.getProfile(userId);
            if (response.success)
                return res.status(200).json({ success: true, message: response.message, user: response.user });
            res.status(500).json({ success: false, message: response.message });
        }
        catch (error) {
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const response = await this.Interactor.updateProfile(userId, req.body.name);
            if (response)
                return res.status(200).json({ success: true, message: "Sucessfully Updated" });
            res.status(500).json({ success: false, message: "Unexpected Error" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = ProfileControllers;
