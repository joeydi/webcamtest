const cloudinary = require("cloudinary").v2;

cloudinary.config({ secure: true });

export default async function handler(req, res) {
    try {
        const result = await cloudinary.uploader.upload(req.body, {
            folder: "webcamtest",
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}
