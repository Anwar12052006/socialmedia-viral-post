export default function StyleSelector({ selectedStyle, onSelectStyle }) {
    const styles = [
        { id: 'ORIGINAL', name: 'Original', thumb: 'none' },
        { id: 'VIBRANT_BOOST', name: 'Vibrant', thumb: 'from-orange-400 to-rose-500' },
        { id: 'BW_CINEMATIC', name: 'Cinematic', thumb: 'from-gray-500 to-gray-800' },
        { id: 'VINTAGE_INSTAGRAM', name: 'Vintage', thumb: 'from-yellow-700 to-red-800' },
        { id: 'SOFT_BLUR', name: 'Soft Blur', thumb: 'from-blue-300 to-indigo-300' },
        { id: 'NEON_GLOW', name: 'Neon Glow', thumb: 'from-fuchsia-500 to-cyan-500' }
    ];

    return (
        <div className="w-full max-w-md mx-auto mt-4 px-2">
            <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-2 snap-x snap-mandatory scrollbar-hide">
                {styles.map((style) => {
                    const isActive = selectedStyle === style.id;
                    return (
                        <button
                            key={style.id}
                            onClick={() => onSelectStyle(style.id)}
                            className={`snap-center shrink-0 flex flex-col items-center gap-2 transition-all duration-300 ${isActive ? 'scale-105 opacity-100' : 'scale-95 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <div
                                className={`w-16 h-16 rounded-full p-[2px] transition-all duration-300 ${isActive ? 'bg-gradient-to-tr from-primary to-secondary shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10'
                                    }`}
                            >
                                <div className="w-full h-full rounded-full bg-surface overflow-hidden border-2 border-[#0f172a] relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${style.thumb} opacity-80 mix-blend-overlay`} />
                                </div>
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                {style.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
