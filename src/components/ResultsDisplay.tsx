import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Volume2 } from "lucide-react";
import { useTTS } from "@/hooks/useSpeech";
import type { AnalysisResult } from "@/hooks/useImageAnalysis";

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const tts = useTTS();

  const playAll = () => {
    tts.speakSequence([
      { text: "Image Description. " + result.image_description, rate: 0.95, pitch: 1.0 },
      { text: "Meme and Vibe Explanation. " + result.meme_explanation, rate: 1.05, pitch: 1.1 },
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in-up" role="region" aria-label="Analysis results">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground glow-text">Results</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={tts.isSpeaking && !tts.isPaused ? "outline" : "glow"}
            onClick={() => {
              if (tts.isSpeaking && !tts.isPaused) tts.pause();
              else if (tts.isPaused) tts.resume();
              else playAll();
            }}
            aria-label={tts.isSpeaking && !tts.isPaused ? "Pause narration" : tts.isPaused ? "Resume narration" : "Play narration"}
          >
            {tts.isSpeaking && !tts.isPaused ? <Pause /> : <Play />}
            {tts.isSpeaking && !tts.isPaused ? "Pause" : tts.isPaused ? "Resume" : "Play All"}
          </Button>
          {tts.isSpeaking && (
            <Button size="sm" variant="destructive" onClick={tts.stop} aria-label="Stop narration">
              <Square /> Stop
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-display font-semibold text-primary">Image Description</h3>
        </div>
        <p className="text-foreground leading-relaxed text-lg">{result.image_description}</p>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => tts.speak(result.image_description, { rate: 0.95 })}
          aria-label="Play image description"
          className="mt-2"
        >
          <Play className="h-4 w-4" /> Play Description
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl" aria-hidden="true">😄</span>
          <h3 className="text-lg font-display font-semibold text-primary">Meme / Vibe Explanation</h3>
        </div>
        <p className="text-foreground leading-relaxed text-lg">{result.meme_explanation}</p>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => tts.speak(result.meme_explanation, { rate: 1.05, pitch: 1.1 })}
          aria-label="Play meme explanation"
          className="mt-2"
        >
          <Play className="h-4 w-4" /> Play Explanation
        </Button>
      </div>
    </div>
  );
}
