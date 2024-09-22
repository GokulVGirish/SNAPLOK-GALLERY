"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthInteractor {
    constructor(Repository, Mailer, AwsS3) {
        this.Repository = Repository;
        this.Mailer = Mailer;
        this.AwsS3 = AwsS3;
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
            return { status: true, message: "Success", access: accessToken, refresh: refreshToken, user: user.name };
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
            let signedUrl = "";
            if (userExist.profilePhoto) {
                const command = this.AwsS3.getObjectCommandS3(userExist.profilePhoto);
                signedUrl = await this.AwsS3.getSignedUrlS3(command, 48 * 3600);
            }
            return {
                status: true,
                message: "Success",
                access: accessToken,
                refresh: refreshToken,
                user: userExist.name,
                img: signedUrl
            };
        }
        catch (error) {
            throw error;
        }
    }
    async passwordResetLink(email) {
        try {
            const user = await this.Repository.userExist(email);
            if (!user)
                return false;
            const resetTokenExpiry = Date.now() + 600000;
            const payload = { email, resetTokenExpiry };
            const hashedToken = jsonwebtoken_1.default.sign(payload, process.env.PASSWORD_RESET_SECRET);
            const resetLink = `${process.env.Origin}/reset-password?token=${hashedToken}`;
            const result = await this.Mailer.sendPasswordResetLink(email, resetLink);
            if (!result)
                return false;
            return true;
        }
        catch (error) {
            throw error;
        }
    }
    async resetPassword(token, password) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.PASSWORD_RESET_SECRET);
            const { email, resetTokenExpiry } = decodedToken;
            const userExist = await this.Repository.userExist(email);
            if (!userExist)
                return { status: false, message: "Invalid User", errorCode: "USER_NOT_FOUND" };
            if (Date.now() > new Date(resetTokenExpiry).getTime())
                return { status: false, message: "Expired Link", errorCode: "LINK_EXPIRED" };
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const response = await this.Repository.resetPassword(email, hashedPassword);
            if (!response)
                return { status: false, message: "Internal server error", errorCode: "INTERNAL_ERROR" };
            return { status: true, message: "Password Changed Sucessfully" };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = AuthInteractor;
