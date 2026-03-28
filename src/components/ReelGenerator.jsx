import { useState, useEffect } from 'react';
import { Film, Download, CheckCircle2 } from 'lucide-react';
import CaptionGenerator from './CaptionGenerator';

export default function ReelGenerator({ canvasRef }) {
    const [template, setTemplate] = useState('MINIMAL_AESTHETIC');
    const [textOverlay, setTextOverlay] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);

    const templates = [
        { id: 'MINIMAL_AESTHETIC', name: 'Minimal Aesthetic', desc: 'Fade in + clean text' },
        { id: 'ZOOM_DRAMATIC', name: 'Zoom Dramatic', desc: 'Slow zoom + suspense' },
        { id: 'GLOW_UP', name: 'Glow Up', desc: 'Bright + bold text' }
    ];



    const handleGenerate = async () => {
        if (!canvasRef.current) return;

        setIsGenerating(true);
        setVideoUrl(null);

        try {
            const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));

            const formData = new FormData();
            formData.append('image', blob, 'processed-image.png');
            formData.append('template', template);
            formData.append('text', textOverlay);

            const response = await fetch('https://socialmedia-viral-post.onrender.com/api/generate-video', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.details || 'Failed to generate video');
            }

            const videoBlob = await response.blob();
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);
        } catch (error) {
            console.error(error);
            alert('Error generating video: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `reel-${Date.now()}.mp4`;
        link.click();
    };

    return (
        <div className="w-full mt-6 bg-surface/40 border border-white/10 rounded-2xl p-5 mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Film className="w-5 h-5 text-secondary" />
                Generate Reel
            </h3>

            {!videoUrl ? (
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs text-white/60 mb-1 block uppercase tracking-wider font-semibold">Template</label>
                        <div className="grid grid-cols-1 gap-2">
                            {templates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTemplate(t.id)}
                                    className={`text-left px-4 py-3 rounded-xl border transition-all ${template === t.id
                                        ? 'border-secondary bg-secondary/10'
                                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                        }`}
                                >
                                    <p className="font-bold text-sm text-white">{t.name}</p>
                                    <p className="text-xs text-white/50">{t.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-white/60 mb-1 block uppercase tracking-wider font-semibold">Optional Text</label>
                        <input
                            type="text"
                            value={textOverlay}
                            onChange={(e) => setTextOverlay(e.target.value)}
                            placeholder="e.g. Wait for it..."
                            maxLength={30}
                            className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing Reel...
                            </>
                        ) : (
                            'Create Video (MP4)'
                        )}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-2 text-green-400 font-semibold bg-green-400/10 px-4 py-2 rounded-full mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Reel Ready!
                    </div>

                    <video
                        src={videoUrl}
                        className="w-full max-w-[240px] rounded-xl border border-white/10"
                        controls
                        autoPlay
                        loop
                        muted
                    />

                    <button
                        onClick={handleDownload}
                        className="w-full py-3.5 rounded-xl bg-white text-surface hover:bg-slate-100 font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95"
                    >
                        <Download className="w-5 h-5" />
                        Download MP4
                    </button>

                    <button
                        onClick={() => setVideoUrl(null)}
                        className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider font-semibold mt-2"
                    >
                        Generate Another
                    </button>

                    <div className="w-full mt-4">
                        <CaptionGenerator type="reel" template={template} />
                    </div>
                </div>
            )}
        </div>
    );
}
