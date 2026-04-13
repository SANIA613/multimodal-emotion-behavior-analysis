import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface WebcamCaptureProps {
  onCapture: (image: string) => void;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const reset = () => {
    setImgSrc(null);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group">
      {!imgSrc ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "user" }}
            mirrored={false}
            imageSmoothing={true}
            forceScreenshotSourceSize={false}
            disablePictureInPicture={true}
            onUserMedia={() => {}}
            onUserMediaError={() => {}}
            screenshotQuality={0.92}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <button
              onClick={capture}
              className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-xl"
            >
              <Camera size={24} />
            </button>
          </div>
        </>
      ) : (
        <div className="relative w-full h-full">
          <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
          <button
            onClick={reset}
            className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4">
        <span className="px-2 py-1 bg-black/60 text-white text-[10px] uppercase tracking-widest font-mono rounded border border-white/20">
          Live Feed: {imgSrc ? 'Captured' : 'Ready'}
        </span>
      </div>
    </div>
  );
};
