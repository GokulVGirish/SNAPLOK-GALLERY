"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isVerified = async (req, res, next) => {
    try {
        const { isVerified } = req.user;
        if (!isVerified)
            return res.status(401).json({ message: "otp not verified" });
        next();
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server Error" });
    }
};
exports.default = isVerified;
