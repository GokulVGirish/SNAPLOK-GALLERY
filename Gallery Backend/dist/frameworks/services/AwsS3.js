"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const iawsS3_1 = __importDefault(require("../../entities/services/iawsS3"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
exports.s3 = new client_s3_1.S3Client({
    region: iawsS3_1.default.BUCKET_REGION,
    credentials: {
        accessKeyId: iawsS3_1.default.ACCESS_KEY,
        secretAccessKey: iawsS3_1.default.SECRET_KEY,
    },
});
class AwsS3 {
    getObjectCommandS3(key) {
        return new client_s3_1.GetObjectCommand({
            Bucket: iawsS3_1.default.BUCKET_NAME,
            Key: key,
        });
    }
    async getSignedUrlS3(command, expiresIn) {
        try {
            const url = await (0, s3_request_presigner_1.getSignedUrl)(exports.s3, command, { expiresIn });
            return url;
        }
        catch (error) {
            console.error("Error getting signed URL:", error);
            throw new Error("Could not get signed URL");
        }
    }
    async putObjectCommandS3(key, image, contentType) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: iawsS3_1.default.BUCKET_NAME,
            Key: key,
            Body: image,
            ContentType: contentType,
        });
        try {
            return await exports.s3.send(command);
        }
        catch (error) {
            console.error("Error uploading image to S3:", error);
            throw new Error("Could not upload image to S3");
        }
    }
    async deleteObjectCommandS3(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: iawsS3_1.default.BUCKET_NAME,
            Key: key,
        });
        try {
            await exports.s3.send(command);
        }
        catch (error) {
            console.error("Error deleting object from S3:", error);
            throw new Error("Could not delete object from S3");
        }
    }
}
exports.default = AwsS3;
