import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

interface UrlPanelProps {
  onUrlSubmit: (url: string) => void;
  isDisabled?: boolean;
}

export default function UrlPanel({ onUrlSubmit, isDisabled }: UrlPanelProps) {
  const [url, setUrl] = useState("");

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border bg-card p-8 transition-colors hover:border-primary/50"
      role="region"
      aria-label="Paste image URL panel"
    >
      <Link className="h-10 w-10 text-primary" aria-hidden="true" />
      <h2 className="text-xl font-display font-semibold text-foreground">Paste Image URL</h2>
      <p className="text-sm text-muted-foreground text-center">
        Enter a direct link to any image
      </p>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="w-full rounded-lg border border-input bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Image URL input"
      />
      <Button
        variant="glow"
        onClick={() => { if (url.trim()) onUrlSubmit(url.trim()); }}
        disabled={isDisabled || !url.trim()}
        aria-label="Analyze image from URL"
      >
        Analyze URL
      </Button>
    </div>
  );
}
