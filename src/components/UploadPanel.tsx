import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadPanelProps {
  onImageSelected: (base64: string) => void;
  isDisabled?: boolean;
}

export default function UploadPanel({ onImageSelected, isDisabled }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelected(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }, [handleFile]);

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border bg-card p-8 transition-colors hover:border-primary/50"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      role="region"
      aria-label="Upload image panel"
    >
      <Upload className="h-10 w-10 text-primary" aria-hidden="true" />
      <h2 className="text-xl font-display font-semibold text-foreground">Upload Image</h2>
      <p className="text-sm text-muted-foreground text-center">
        Drag & drop or click to upload PNG, JPG, WEBP
      </p>
      {preview && (
        <img src={preview} alt="Uploaded preview" className="max-h-40 rounded-lg object-contain" />
      )}
      <Button
        variant="glow"
        onClick={() => inputRef.current?.click()}
        disabled={isDisabled}
        aria-label="Choose image file to upload"
      >
        Choose File
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        aria-hidden="true"
      />
    </div>
  );
}
