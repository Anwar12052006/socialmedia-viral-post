import { Download, RefreshCcw } from 'lucide-react';

export default function ActionBar({ onDownload, onReset }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/5 glass z-50">
            <div className="max-w-md mx-auto flex gap-4">
                <button
                    onClick={onReset}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all active:scale-95"
                >
                    <RefreshCcw className="w-5 h-5" />
                    <span>Reset</span>
                </button>
                <button
                    onClick={onDownload}
                    className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-surface hover:bg-slate-100 font-bold shadow-[0_4px_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                >
                    <Download className="w-5 h-5" />
                    <span>Download Image</span>
                </button>
            </div>
        </div>
    );
}
