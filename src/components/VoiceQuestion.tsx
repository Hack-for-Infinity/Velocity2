import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";
import { useSTT, useTTS } from "@/hooks/useSpeech";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";

interface VoiceQuestionProps {
  imageBase64?: string;
  imageUrl?: string;
  context: string;
}

export default function VoiceQuestion({ imageBase64, imageUrl, context }: VoiceQuestionProps) {
  const stt = useSTT();
  const tts = useTTS();
  const { askQuestion } = useImageAnalysis();
  const [textInput, setTextInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const handleQuestion = async (question: string) => {
    if (!question.trim()) return;
    setIsAsking(true);
    setAnswer("");
    const result = await askQuestion(question, { imageBase64, imageUrl, context });
    setAnswer(result);
    tts.speak(result);
    setIsAsking(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4" role="region" aria-label="Ask questions about the image">
      <h3 className="text-lg font-display font-semibold text-primary flex items-center gap-2">
        <Mic className="h-5 w-5" /> Ask About This Image
      </h3>
      <p className="text-sm text-muted-foreground">
        Type or use your voice to ask questions about the image
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={stt.isListening ? stt.transcript : textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="e.g. What color is the background?"
          className="flex-1 rounded-lg border border-input bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => { if (e.key === "Enter") handleQuestion(textInput); }}
          aria-label="Question input"
        />
        <Button
          size="icon"
          variant={stt.isListening ? "destructive" : "outline"}
          onClick={() => {
            if (stt.isListening) stt.stopListening();
            else stt.startListening(handleQuestion);
          }}
          aria-label={stt.isListening ? "Stop listening" : "Start voice input"}
        >
          {stt.isListening ? <MicOff /> : <Mic />}
        </Button>
        <Button
          size="icon"
          variant="glow"
          onClick={() => handleQuestion(textInput)}
          disabled={isAsking || !textInput.trim()}
          aria-label="Send question"
        >
          <Send />
        </Button>
      </div>

      {stt.isListening && (
        <p className="text-sm text-primary animate-pulse" aria-live="polite">🎙️ Listening... {stt.transcript}</p>
      )}
      {isAsking && (
        <p className="text-sm text-muted-foreground animate-pulse" aria-live="polite">Thinking...</p>
      )}
      {answer && (
        <div className="rounded-lg bg-secondary p-4" aria-live="polite">
          <p className="text-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
