import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Mic, MicOff } from "lucide-react";
import { useSTT, useTTS } from "@/hooks/useSpeech";

interface VoiceChatbotProps {
  onCommand: (command: string) => void;
}

const COMMANDS = [
  { keywords: ["open camera", "start camera", "camera"], action: "open_camera" },
  { keywords: ["capture", "take photo", "take picture", "snap"], action: "capture" },
  { keywords: ["upload", "upload image", "upload file"], action: "upload" },
  { keywords: ["analyze", "analyse", "analyze this", "analyze image"], action: "analyze" },
  { keywords: ["explain meme", "explain the meme", "meme"], action: "explain_meme" },
  { keywords: ["stop audio", "stop", "silence", "quiet"], action: "stop_audio" },
  { keywords: ["help", "what can you do", "commands"], action: "help" },
];

export default function VoiceChatbot({ onCommand }: VoiceChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([]);
  const stt = useSTT();
  const tts = useTTS();

  const addMessage = useCallback((role: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev.slice(-20), { role, text }]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = "Welcome to See For Me! I can help you explore images. Say 'open camera', 'upload', or 'help' for all commands.";
      addMessage("bot", greeting);
      tts.speak(greeting, { rate: 0.95 });
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processCommand = useCallback((text: string) => {
    addMessage("user", text);
    const lower = text.toLowerCase();

    for (const cmd of COMMANDS) {
      if (cmd.keywords.some((kw) => lower.includes(kw))) {
        if (cmd.action === "help") {
          const helpText = "You can say: Open camera, Capture, Upload an image, Analyze this image, Explain the meme, or Stop audio.";
          addMessage("bot", helpText);
          tts.speak(helpText);
          return;
        }
        if (cmd.action === "stop_audio") {
          tts.stop();
          addMessage("bot", "Audio stopped.");
          return;
        }
        onCommand(cmd.action);
        addMessage("bot", `Got it! Executing: ${cmd.action.replace("_", " ")}`);
        tts.speak(`Executing ${cmd.action.replace("_", " ")}`);
        return;
      }
    }

    addMessage("bot", "I didn't understand that. Say 'help' for available commands.");
    tts.speak("I didn't understand. Say help for available commands.");
  }, [addMessage, onCommand, tts]);

  return (
    <div className="fixed top-4 right-4 z-50" role="complementary" aria-label="Voice assistant chatbot">
      {isOpen ? (
        <div className="w-80 max-h-96 flex flex-col rounded-xl border border-border bg-card shadow-2xl animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-display font-semibold text-primary text-sm">🤖 See For Me Assistant</h3>
            <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} className="h-8 w-8" aria-label="Close assistant">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-60">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm rounded-lg px-3 py-2 ${
                  msg.role === "bot"
                    ? "bg-secondary text-foreground"
                    : "bg-primary/20 text-foreground ml-auto max-w-[80%]"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3 flex justify-center">
            <Button
              variant={stt.isListening ? "destructive" : "glow"}
              size="sm"
              onClick={() => {
                if (stt.isListening) stt.stopListening();
                else stt.startListening(processCommand);
              }}
              aria-label={stt.isListening ? "Stop listening" : "Start voice command"}
            >
              {stt.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {stt.isListening ? "Listening..." : "Speak Command"}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          size="icon"
          variant="glow"
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-xl"
          aria-label="Open voice assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
