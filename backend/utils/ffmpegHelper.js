import { exec } from 'child_process';
import path from 'path';

export const createVideo = async (inputPath, outputPath, template, textOverlay) => {
    return new Promise((resolve, reject) => {
        let inputPathFmt = inputPath.replace(/\\/g, '/');
        let outputPathFmt = outputPath.replace(/\\/g, '/');

        const duration = 6;
        let textFilter = '';

        if (textOverlay) {
            const safeText = textOverlay.replace(/'/g, ""); // Strip quotes to prevent command injection/failure
            // We use a safe Windows font path. Colon in path requires escaping for FFmpeg filters.
            const fontPath = "C\\\\:/Windows/Fonts/arial.ttf";
            textFilter = `,drawtext=fontfile='${fontPath}':text='${safeText}':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=h-300:shadowcolor=black:shadowx=2:shadowy=2`;
        }

        let filterComplex = '';

        switch (template) {
            case 'ZOOM_DRAMATIC':
                // Zoompan handles scaling inherently into 1080x1920
                filterComplex = `zoompan=z='min(zoom+0.0015,1.5)':d=${duration * 25}:s=1080x1920${textFilter}`;
                break;

            case 'GLOW_UP':
                // Force 9:16 aspect ratio, increase brightness and contrast
                filterComplex = `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=brightness=0.08:contrast=1.3${textFilter}`;
                break;

            case 'MINIMAL_AESTHETIC':
            default:
                // Scale and crop to 9:16 + fade in
                filterComplex = `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fade=t=in:st=0:d=1${textFilter}`;
                break;
        }

        // -y overrides output if exists
        // -loop 1 loops the single image to create a video
        // -pix_fmt yuv420p ensures maximum compatibility (like Instagram)
        const command = `ffmpeg -y -loop 1 -i "${inputPathFmt}" -vf "${filterComplex}" -t ${duration} -c:v libx264 -pix_fmt yuv420p "${outputPathFmt}"`;

        console.log('Running FFmpeg Command:', command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('FFmpeg stderr output:', stderr);
                return reject(error);
            }
            resolve();
        });
    });
};
