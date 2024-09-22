import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import s3Config from "../../entities/services/iawsS3";
import { IawsS3 } from "../../entities/services/iawsS3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const s3 = new S3Client({
  region: s3Config.BUCKET_REGION,
  credentials: {
    accessKeyId: s3Config.ACCESS_KEY,
    secretAccessKey: s3Config.SECRET_KEY,
  },
});


class AwsS3 implements IawsS3 {


  getObjectCommandS3(key: string): GetObjectCommand {
    return new GetObjectCommand({
      Bucket: s3Config.BUCKET_NAME,
      Key: key,
    });
  }

  async getSignedUrlS3(command: GetObjectCommand, expiresIn: number) {
    try {
      const url = await getSignedUrl(s3, command, { expiresIn });
      return url;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw new Error("Could not get signed URL");
    }
  }

  async putObjectCommandS3(key: string, image: Buffer, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: s3Config.BUCKET_NAME,
      Key: key,
      Body: image,
      ContentType: contentType,
    });

    try {
      return await s3.send(command);
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      throw new Error("Could not upload image to S3");
    }
  }

  async deleteObjectCommandS3(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: s3Config.BUCKET_NAME,
      Key: key,
    });

    try {
      await s3.send(command);
    } catch (error) {
      console.error("Error deleting object from S3:", error);
      throw new Error("Could not delete object from S3");
    }
  }
}

export default AwsS3;
