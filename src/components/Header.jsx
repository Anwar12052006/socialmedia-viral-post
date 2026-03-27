export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 pb-3">
            <div className="max-w-md mx-auto px-4 pt-4 flex flex-col items-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pt-1">
                    InstaGen AI
                </h1>
                <p className="text-xs text-slate-300 tracking-wider font-light mt-1 uppercase">
                    Create viral posts in seconds
                </p>
            </div>
        </header>
    );
}
