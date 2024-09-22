"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, req, res, next) => {
    console.log("error", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message || "An unexpected error occurred",
    });
};
exports.default = errorHandler;
