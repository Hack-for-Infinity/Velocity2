import { useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Aperture } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";

interface CameraPanelProps {
  onCapture: (base64: string) => void;
  isDisabled?: boolean;
  externalStart?: boolean;
  externalCapture?: boolean;
  onStarted?: () => void;
  onCaptured?: () => void;
}

export default function CameraPanel({ onCapture, isDisabled, externalStart, externalCapture, onStarted, onCaptured }: CameraPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { startCamera, stopCamera, captureFrame, isActive, error } = useCamera();

  const handleStart = useCallback(async () => {
    if (videoRef.current) {
      await startCamera(videoRef.current);
      onStarted?.();
    }
  }, [startCamera, onStarted]);

  const handleCapture = useCallback(() => {
    const frame = captureFrame();
    if (frame) {
      onCapture(frame);
      onCaptured?.();
    }
  }, [captureFrame, onCapture, onCaptured]);

  useEffect(() => {
    if (externalStart && !isActive && videoRef.current) {
      handleStart();
    }
  }, [externalStart, isActive, handleStart]);

  useEffect(() => {
    if (externalCapture && isActive) {
      handleCapture();
    }
  }, [externalCapture, isActive, handleCapture]);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border bg-card p-8 transition-colors hover:border-primary/50"
      role="region"
      aria-label="Camera capture panel"
    >
      <Camera className="h-10 w-10 text-primary" aria-hidden="true" />
      <h2 className="text-xl font-display font-semibold text-foreground">Camera</h2>
      <p className="text-sm text-muted-foreground text-center">
        Capture from your device camera
      </p>

      <div className="relative w-full overflow-hidden rounded-lg bg-secondary aspect-video">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          aria-label="Camera preview"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CameraOff className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

      <div className="flex gap-3">
        {!isActive ? (
          <Button variant="glow" onClick={handleStart} disabled={isDisabled} aria-label="Start camera">
            <Camera className="h-5 w-5" /> Start Camera
          </Button>
        ) : (
          <>
            <Button variant="glow" onClick={handleCapture} disabled={isDisabled} aria-label="Capture photo">
              <Aperture className="h-5 w-5" /> Capture
            </Button>
            <Button variant="outline" onClick={stopCamera} aria-label="Stop camera">
              <CameraOff className="h-5 w-5" /> Stop
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
