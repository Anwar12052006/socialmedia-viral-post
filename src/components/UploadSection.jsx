import { UploadCloud } from 'lucide-react';

export default function UploadSection({ onUpload }) {
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) onUpload(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) onUpload(file);
    };

    return (
        <div
            className="flex-1 w-full flex items-center justify-center py-20"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <label className="relative flex flex-col items-center justify-center w-full aspect-square max-w-sm rounded-[2rem] border-2 border-dashed border-white/20 bg-surface/30 backdrop-blur hover:bg-surface/50 transition-all cursor-pointer group shadow-2xl overflow-hidden glass">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                    <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-10 h-10 text-primary" />
                    </div>
                    <p className="mb-2 text-sm font-semibold text-white/90">
                        <span className="font-bold">Click</span> or <span className="font-bold">Drag & Drop</span>
                    </p>
                    <p className="text-xs text-white/50">High-res Images (PNG, JPG, WEBP)</p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                />
            </label>
        </div>
    );
}
