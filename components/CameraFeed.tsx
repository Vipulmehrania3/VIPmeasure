import React, { useEffect, useRef } from 'react';

interface CameraFeedProps {
  onStreamReady: (stream: MediaStream) => void;
  onError: (error: Error) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onStreamReady, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          onStreamReady(stream);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        onError(err as Error);
      }
    };

    enableStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onStreamReady, onError]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
    ></video>
  );
};

export default CameraFeed;