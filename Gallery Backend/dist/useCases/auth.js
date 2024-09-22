"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthInteractor {
    constructor(Repository, Mailer) {
        this.Repository = Repository;
        this.Mailer = Mailer;
    }
    async otpSignup(userData) {
        try {
            const userExist = await this.Repository.userExist(userData.email);
            if (userExist)
                return { status: false, message: "User Already Exist", errorCode: "Already_Exist" };
            const sent = await this.Mailer.sendMail(userData.email);
            if (!sent.success)
                return { status: false, message: "Error sending otp", errorCode: "OTP_Send_Error" };
            const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
            const otpUserCreate = await this.Repository.createOtpUser({ ...userData, otp: sent.otp, password: hashedPassword });
            if (!otpUserCreate)
                return { status: false, message: "Something Went Wrong", errorCode: "Server_Error" };
            const token = jsonwebtoken_1.default.sign({
                userId: otpUserCreate._id,
                email: userData.email,
                isVerified: false,
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
            return { status: true, message: "Success", token: token };
        }
        catch (error) {
            throw error;
        }
    }
    async otpValidateSignup(email, otp) {
        try {
            const otpUser = await this.Repository.getOtpUser(email);
            if (!otpUser)
                return { status: false, message: "Try Signing Up Again", errorCode: "Invalid_User" };
            if (otp !== otpUser.otp)
                return {
                    status: false,
                    message: "Otp Expired",
                    errorCode: "Wrong",
                };
            if (new Date() > otpUser.otpExpires)
                return {
                    status: false,
                    message: "Otp Expired",
                    errorCode: "Expired",
                };
            const user = await this.Repository.createUser(otpUser);
            const accessToken = jsonwebtoken_1.default.sign({
                userId: user._id,
                email: user.email,
                isVerified: true,
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            const refreshToken = jsonwebtoken_1.default.sign({
                userId: user._id,
                email: user.email,
                isVerified: true,
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
            return { status: true, message: "Success", access: accessToken, refresh: refreshToken };
        }
        catch (error) {
            throw error;
        }
    }
    async Login(data) {
        try {
            const userExist = await this.Repository.userExist(data.email);
            if (!userExist)
                return { status: false, message: "User not found", errorCode: "No_User" };
            const hashedPassword = userExist.password;
            const isVerified = await bcryptjs_1.default.compare(data.password, hashedPassword);
            if (!isVerified)
                return { status: false, message: "Wrong password", errorCode: "Wrong_Pass" };
            const accessToken = jsonwebtoken_1.default.sign({
                userId: userExist._id,
                email: userExist.email,
                isVerified: true,
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            const refreshToken = jsonwebtoken_1.default.sign({
                userId: userExist._id,
                email: userExist.email,
                isVerified: true,
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
            return {
                status: true,
                message: "Success",
                access: accessToken,
                refresh: refreshToken,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = AuthInteractor;
