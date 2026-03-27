import { useEffect, useCallback } from 'react';
import { applyFilterToContext } from '../utils/imageEffects';

export default function PreviewCanvas({ image, filterStyle, canvasRef }) {
    const drawImage = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set fixed optimal width and calculate height based on 9:16 ratio
        const outputWidth = Math.min(1080, image.width);
        const outputHeight = (outputWidth * 16) / 9;

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
        const x = (canvas.width / 2) - (image.width / 2) * scale;
        const y = (canvas.height / 2) - (image.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        applyFilterToContext(ctx, filterStyle);

        // Additional Neon Glow hack applied via shadow before drawing
        if (filterStyle === 'NEON_GLOW') {
            ctx.shadowColor = 'rgba(236,72,153,0.8)';
            ctx.shadowBlur = 40;
        }

        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

        ctx.filter = 'none';
    }, [image, filterStyle, canvasRef]);

    useEffect(() => {
        drawImage();
    }, [drawImage]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full object-cover transition-all duration-300"
        />
    );
}
