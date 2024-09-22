"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token, type) => {
    try {
        return jsonwebtoken_1.default.verify(token, type === "access"
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        return null;
    }
};
const authMiddleware = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
        return res.status(401).json({ message: "No token provided" });
    const decodedAccessToken = verifyToken(accessToken, "access");
    if (decodedAccessToken) {
        req.user = decodedAccessToken;
        return next();
    }
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ message: "No token provided" });
    const decodedRefreshToken = verifyToken(refreshToken, "refresh");
    if (decodedRefreshToken) {
        const { userId, email, isVerified } = decodedRefreshToken;
        const newAccessToken = jsonwebtoken_1.default.sign({ userId, email, isVerified }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        req.user = decodedRefreshToken;
        res.cookie("accessToken", newAccessToken, {
            path: "/",
            httpOnly: true,
        });
        return next();
    }
    res.clearCookie("refreshToken");
    res.clearCookie("refreshToken");
    res.status(401).json({ message: "Session expired, please log in again" });
};
exports.default = authMiddleware;
