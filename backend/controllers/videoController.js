import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createVideo } from '../utils/ffmpegHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const { template = 'MINIMAL_AESTHETIC', text = '' } = req.body;
        const inputImagePath = req.file.path;
        const outputVideoName = `reel-${Date.now()}.mp4`;
        const outputVideoPath = path.join(__dirname, '../uploads', outputVideoName);

        console.log(`Processing Reel Request: Template=${template}, Text=${text}`);

        await createVideo(inputImagePath, outputVideoPath, template, text);

        res.download(outputVideoPath, outputVideoName, (err) => {
            // Cleanup files immediately after streaming completion
            if (fs.existsSync(inputImagePath)) {
                fs.unlinkSync(inputImagePath);
            }
            if (fs.existsSync(outputVideoPath)) {
                fs.unlinkSync(outputVideoPath);
            }
            if (err && !res.headersSent) {
                res.status(500).json({ error: 'Failed to download video' });
            }
        });

    } catch (error) {
        console.error('Video generation error:', error);

        // Cleanup input on failure
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to generate video', details: error.message });
    }
};
