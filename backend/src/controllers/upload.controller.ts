import { Request, Response } from "express";
import { uploadCSV } from "../services/upload.service";
import { uploadImageToCloudinary } from "../services/cloundinar.service";

export const handleCSVUpload = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ success: false, error: "CSV file is required" });
        return;
    }

    try {
        const result = await uploadCSV(req.file.buffer);
        res.status(201).json({ success: true, ...result });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

//image upload also here(cloudinary setup)
export const handleImageUpload = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ success: false, error: "Image file is required" });
        return;
    }


  try {
    const result = await uploadImageToCloudinary(req.file.buffer, "vihaan26/initial");

    res.status(201).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
