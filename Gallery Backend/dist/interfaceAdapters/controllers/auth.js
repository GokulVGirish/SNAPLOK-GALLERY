"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthControllers {
    constructor(Interactor) {
        this.Interactor = Interactor;
    }
    async verifyToken(req, res, next) {
        try {
            res.status(200).json({ success: true, message: "Valid Token" });
        }
        catch (error) {
            next(error);
        }
    }
    async removeToken(req, res, next) {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json({ success: true });
        }
        catch (error) {
            throw error;
        }
    }
    async otpSignup(req, res, next) {
        try {
            console.log("request body", req.body);
            const response = await this.Interactor.otpSignup(req.body);
            if (response.status) {
                res.cookie("accessToken", response.token, { httpOnly: true });
                return res
                    .status(201)
                    .json({ success: true, message: response.message });
            }
            switch (response.errorCode) {
                case "Already_Exist":
                    return res
                        .status(409)
                        .json({ success: false, message: response.message });
                default:
                    return res
                        .status(500)
                        .json({ success: false, message: response.message });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async otpValidateSignup(req, res, next) {
        try {
            const otp = req.body.otp;
            const email = req.user.email;
            const response = await this.Interactor.otpValidateSignup(email, otp);
            if (response.status) {
                res.cookie("accessToken", response.access);
                res.cookie("refreshToken", response.refresh);
                return res
                    .status(201)
                    .json({ success: true, message: response.message });
            }
            switch (response.errorCode) {
                case "Invalid_User":
                    return res
                        .status(401)
                        .json({ success: false, message: response.message });
                case "Expired":
                    return res
                        .status(400)
                        .json({ success: false, message: response.message });
                case "Wrong":
                    return res
                        .status(500)
                        .json({ success: false, message: response.message });
                default:
                    return res
                        .status(500)
                        .json({ success: false, message: response.message });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async Login(req, res, next) {
        try {
            const response = await this.Interactor.Login(req.body);
            if (response.status) {
                res.cookie("accessToken", response.access);
                res.cookie("refreshToken", response.refresh);
                return res
                    .status(200)
                    .json({ success: true, message: response.message });
            }
            switch (response.errorCode) {
                case "No_User": return res.status(404).json({ success: false, message: response.message });
                case "Wrong_Pass": return res.status(403).json({ success: false, message: response.message });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async Logout(req, res, next) {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AuthControllers;
