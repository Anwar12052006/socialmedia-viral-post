import { useState, useEffect } from 'react';
import { Copy, RefreshCw, Wand2, CheckCircle2 } from 'lucide-react';
import { generateCaption, generateHashtags } from '../utils/captionEngine';

const TONES = [
    { id: 'viral', label: 'Viral 🔥' },
    { id: 'aesthetic', label: 'Aesthetic ✨' },
    { id: 'motivational', label: 'Motivate 💪' },
    { id: 'funny', label: 'Funny 😂' },
    { id: 'attitude', label: 'Attitude 😎' },
    { id: 'glow', label: 'Glow Up 📈' }
];

export default function CaptionGenerator({ type = 'post', template = 'any' }) {
    const [selectedTone, setSelectedTone] = useState(TONES[0].id);
    const [caption, setCaption] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [displayedCaption, setDisplayedCaption] = useState('');
    const [copied, setCopied] = useState(false);

    // Typing effect logic
    useEffect(() => {
        if (!isGenerating && caption) {
            let i = 0;
            setDisplayedCaption('');
            const interval = setInterval(() => {
                setDisplayedCaption((prev) => prev + caption.charAt(i));
                i++;
                if (i >= caption.length) {
                    clearInterval(interval);
                }
            }, 30); // Speed of typing

            return () => clearInterval(interval);
        } else if (!caption) {
            setDisplayedCaption('');
        }
    }, [caption, isGenerating]);

    const handleGenerate = () => {
        setIsGenerating(true);
        setCaption('');
        setHashtags('');
        setCopied(false);

        // Fake AI delay 300-500ms
        const delay = Math.floor(Math.random() * 200) + 300;
        setTimeout(() => {
            const newCaption = generateCaption(type, selectedTone, template);
            const newHashtags = generateHashtags(selectedTone, 8);

            setCaption(newCaption);
            setHashtags(newHashtags);
            setIsGenerating(false);
        }, delay);
    };

    const handleCopyAll = async () => {
        if (!caption && !hashtags) return;

        const textToCopy = `${caption}\n.\n.\n.\n${hashtags}`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="w-full mt-6 bg-surface/40 border border-white/10 rounded-2xl p-5 mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Wand2 className="w-5 h-5 text-primary" />
                AI Caption Generator
            </h3>

            <div className="flex flex-col gap-4">
                {/* Tone Selector */}
                <div>
                    <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider font-semibold">
                        Select Vibe / Tone
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {TONES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTone(t.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedTone === t.id
                                        ? 'border-primary bg-primary/20 text-white'
                                        : 'border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button Wrapper */}
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-4 h-4" />
                            {caption ? 'Regenerate' : 'Generate Caption'}
                        </>
                    )}
                </button>

                {/* Output Area */}
                {(caption || isGenerating) && (
                    <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col gap-3 mt-2">
                        <div className="relative">
                            <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider font-semibold">
                                Caption
                            </label>
                            <textarea
                                value={isGenerating ? '' : Math.abs(caption.length - displayedCaption.length) > 1 ? displayedCaption + '|' : displayedCaption}
                                onChange={(e) => {
                                    setCaption(e.target.value);
                                    setDisplayedCaption(e.target.value);
                                }}
                                className="w-full bg-surface border border-white/10 rounded-xl p-3 text-sm text-white resize-none h-24 focus:outline-none focus:border-primary transition-colors"
                                placeholder="Generating magic..."
                            />
                        </div>

                        {hashtags && !isGenerating && (
                            <div className="relative">
                                <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider font-semibold">
                                    Hashtags
                                </label>
                                <textarea
                                    value={hashtags}
                                    onChange={(e) => setHashtags(e.target.value)}
                                    className="w-full bg-surface border border-white/10 rounded-xl p-3 text-sm text-primary/80 resize-none h-20 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        )}

                        {!isGenerating && caption && (
                            <button
                                onClick={handleCopyAll}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${copied
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gradient-to-r from-primary to-secondary text-white'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Copied to Clipboard! ✅
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5" />
                                        Copy Caption & Hashtags
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
