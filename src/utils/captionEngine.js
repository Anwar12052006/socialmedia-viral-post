import captionsData from '../data/captions.json';
import hashtagsData from '../data/hashtags.json';

// Keep track of the last generated caption index/id to avoid immediate repeats.
let lastCaptionText = null;

/**
 * Generate a random integer between min and max (inclusive of min, exclusive of max)
 */
const getRandomInt = (max) => Math.floor(Math.random() * max);

/**
 * Generate a smart caption based on type, tone, and optionally template.
 * @param {string} type - 'reel' or 'post'
 * @param {string} tone - e.g. 'viral', 'glow', 'aesthetic', 'funny', 'motivational', 'attitude'
 * @param {string} template - e.g. 'ZOOM_DRAMATIC', 'MINIMAL_AESTHETIC', 'GLOW_UP', or 'any'
 * @returns {string} - The generated caption string.
 */
export const generateCaption = (type, tone, template = 'any') => {
    // Filter matching captions
    let validCaptions = captionsData.filter((caption) => {
        const matchesType = caption.type === type || caption.type === 'any';
        const matchesTone = caption.tone === tone || tone === 'any';
        const matchesTemplate =
            caption.template === template ||
            caption.template === 'any' ||
            template === 'any';

        return matchesType && matchesTone && matchesTemplate;
    });

    // Fallback if too restrictive: loosen template first
    if (validCaptions.length === 0) {
        validCaptions = captionsData.filter((c) => c.type === type && c.tone === tone);
    }
    // Fallback if still empty: loosen tone
    if (validCaptions.length === 0) {
        validCaptions = captionsData.filter((c) => c.type === type);
    }
    // Final fallback
    if (validCaptions.length === 0) {
        validCaptions = captionsData;
    }

    // Attempt to not repeat the immediately previous caption if there's more than one choice
    if (validCaptions.length > 1 && lastCaptionText) {
        validCaptions = validCaptions.filter(c => c.text !== lastCaptionText);
    }

    const randomIndex = getRandomInt(validCaptions.length);
    const selectedText = validCaptions[randomIndex].text;

    lastCaptionText = selectedText;

    return selectedText;
};

/**
 * Generate a string of randomized hashtags for the specific tone.
 * @param {string} tone - e.g. 'viral', 'glow', 'aesthetic'
 * @param {number} count - number of hashtags to return (default 5)
 * @returns {string} - Space-separated hashtags
 */
export const generateHashtags = (tone, count = 5) => {
    const rawHashtags = hashtagsData[tone] || hashtagsData['aesthetic'];

    // Shuffle copy of the array
    const shuffled = [...rawHashtags].sort(() => 0.5 - Math.random());

    // Select the first `count` hashtags
    const selected = shuffled.slice(0, Math.min(count, rawHashtags.length));

    return selected.join(' ');
};

/**
 * Main wrapper to get both at once formatted nicely.
 */
export const generateFullCaption = (type, tone, template = 'any') => {
    const captionText = generateCaption(type, tone, template);
    // Add some random emojis padding maybe if we want to enhance it.
    const hashtagsText = generateHashtags(tone, 7);

    // Instagram standard format: Caption, some visual break, then hashtags
    return `${captionText}\n.\n.\n.\n${hashtagsText}`;
};
