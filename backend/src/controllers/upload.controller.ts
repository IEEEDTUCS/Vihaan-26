import { Request, Response } from "express";
import { uploadCSV } from "../services/upload.service";

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

//image upload also here

