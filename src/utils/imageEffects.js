export const applyFilterToContext = (ctx, style) => {
    switch (style) {
        case 'VIBRANT_BOOST':
            ctx.filter = 'contrast(120%) saturate(150%) brightness(110%)';
            break;
        case 'BW_CINEMATIC':
            ctx.filter = 'grayscale(100%) contrast(130%)';
            break;
        case 'VINTAGE_INSTAGRAM':
            ctx.filter = 'sepia(60%) contrast(110%) brightness(105%)';
            break;
        case 'SOFT_BLUR':
            ctx.filter = 'blur(2px) brightness(105%)';
            break;
        case 'NEON_GLOW':
            ctx.filter = 'brightness(120%) saturate(120%) contrast(110%)';
            break;
        case 'ORIGINAL':
        default:
            ctx.filter = 'none';
            break;
    }
};
