import { useState, useRef } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import PreviewCanvas from './components/PreviewCanvas';
import StyleSelector from './components/StyleSelector';
import ActionBar from './components/ActionBar';
import ReelGenerator from './components/ReelGenerator';
import CaptionGenerator from './components/CaptionGenerator';
import { applyFilterToContext } from './utils/imageEffects';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('ORIGINAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);

  const handleUpload = (file) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setUploadedImage(img);
    };
    img.src = url;
  };

  const handleStyleChange = (style) => {
    setIsProcessing(true);
    setSelectedStyle(style);
    // Simulate processing time for "premium" feel
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `instagen-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedStyle('ORIGINAL');
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center">
      <Header />

      <main className="flex-1 w-full max-w-lg px-4 py-6 flex flex-col gap-6 mt-16 pb-24">
        {!uploadedImage ? (
          <UploadSection onUpload={handleUpload} />
        ) : (
          <>
            <div className="relative w-full aspect-[9/16] max-h-[60vh] mx-auto rounded-xl overflow-hidden glass shadow-2xl">
              <PreviewCanvas
                image={uploadedImage}
                filterStyle={selectedStyle}
                canvasRef={canvasRef}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity z-10">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="mt-3 text-sm font-medium tracking-wide">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            <StyleSelector
              selectedStyle={selectedStyle}
              onSelectStyle={handleStyleChange}
            />

            <CaptionGenerator type="post" template={selectedStyle} />

            <div className="w-full h-px bg-white/10 my-2" />

            <ReelGenerator canvasRef={canvasRef} />
          </>
        )}
      </main>

      {uploadedImage && (
        <ActionBar
          onDownload={handleDownload}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
