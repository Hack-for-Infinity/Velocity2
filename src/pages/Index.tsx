import { useState, useCallback, useRef } from "react";
import { Eye, Loader2 } from "lucide-react";
import UploadPanel from "@/components/UploadPanel";
import UrlPanel from "@/components/UrlPanel";
import CameraPanel from "@/components/CameraPanel";
import ResultsDisplay from "@/components/ResultsDisplay";
import VoiceQuestion from "@/components/VoiceQuestion";
import VoiceChatbot from "@/components/VoiceChatbot";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { useTTS } from "@/hooks/useSpeech";

const Index = () => {
  const { analyzeImage, isAnalyzing, result } = useImageAnalysis();
  const tts = useTTS();
  const [currentImage, setCurrentImage] = useState<{ base64?: string; url?: string }>({});
  const [cameraCommand, setCameraCommand] = useState<{ start: boolean; capture: boolean }>({ start: false, capture: false });
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = useCallback(async (opts: { imageBase64?: string; imageUrl?: string }) => {
    setCurrentImage({ base64: opts.imageBase64, url: opts.imageUrl });
    const res = await analyzeImage(opts);
    if (res) {
      tts.speakSequence([
        { text: "Image Description. " + res.image_description, rate: 0.95, pitch: 1.0 },
        { text: "Meme and Vibe Explanation. " + res.meme_explanation, rate: 1.05, pitch: 1.1 },
      ]);
    }
  }, [analyzeImage, tts]);

  const handleCommand = useCallback((action: string) => {
    switch (action) {
      case "open_camera":
        setCameraCommand((p) => ({ ...p, start: true }));
        break;
      case "capture":
        setCameraCommand((p) => ({ ...p, capture: true }));
        break;
      case "upload":
        uploadRef.current?.querySelector("button")?.click();
        break;
      case "stop_audio":
        tts.stop();
        break;
    }
  }, [tts]);

  return (
    <div className="min-h-screen bg-background">
      <VoiceChatbot onCommand={handleCommand} />

      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-center gap-3 py-6 px-4">
          <Eye className="h-8 w-8 text-primary" aria-hidden="true" />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            SEE <span className="text-primary glow-text">FOR ME</span>
          </h1>
        </div>
        <p className="text-center text-muted-foreground pb-4 px-4 text-lg">
          AI-powered image descriptions & meme explanations for everyone
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10 max-w-5xl">
        {/* Input Panels */}
        <div className="grid gap-6 md:grid-cols-3" ref={uploadRef}>
          <UploadPanel
            onImageSelected={(b64) => handleAnalyze({ imageBase64: b64 })}
            isDisabled={isAnalyzing}
          />
          <UrlPanel
            onUrlSubmit={(url) => handleAnalyze({ imageUrl: url })}
            isDisabled={isAnalyzing}
          />
          <CameraPanel
            onCapture={(b64) => handleAnalyze({ imageBase64: b64 })}
            isDisabled={isAnalyzing}
            externalStart={cameraCommand.start}
            externalCapture={cameraCommand.capture}
            onStarted={() => setCameraCommand((p) => ({ ...p, start: false }))}
            onCaptured={() => setCameraCommand((p) => ({ ...p, capture: false }))}
          />
        </div>

        {/* Loading */}
        {isAnalyzing && (
          <div className="flex flex-col items-center gap-4 py-10" role="status" aria-live="polite">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-lg text-muted-foreground font-display">Analyzing image with AI...</p>
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <>
            <ResultsDisplay result={result} />
            <VoiceQuestion
              imageBase64={currentImage.base64}
              imageUrl={currentImage.url}
              context={`Image Description: ${result.image_description}\nMeme Explanation: ${result.meme_explanation}`}
            />
          </>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        SEE FOR ME — Making the visual world accessible through AI
      </footer>
    </div>
  );
};

export default Index;
