import cloudinary from "../config/cloudinary";
import { Readable } from "stream";
import type { UploadApiResponse } from "cloudinary";

function bufferToStream(buffer: Buffer) {
  return new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
}

export const uploadImageToCloudinary = (
  buffer: Buffer,
  folder = "uploads"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve(result);
      }
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
};