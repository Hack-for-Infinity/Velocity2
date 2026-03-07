import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalysisResult {
  image_description: string;
  meme_explanation: string;
}

export function useImageAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (opts: { imageBase64?: string; imageUrl?: string }) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-image", {
        body: opts,
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data as AnalysisResult);
      return data as AnalysisResult;
    } catch (e: any) {
      const msg = e?.message || "Analysis failed";
      setError(msg);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const askQuestion = useCallback(async (question: string, opts: { imageBase64?: string; imageUrl?: string; context?: string }) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("ask-about-image", {
        body: { question, ...opts },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      return data.answer as string;
    } catch (e: any) {
      return "Sorry, I couldn't process that question.";
    }
  }, []);

  return { analyzeImage, askQuestion, isAnalyzing, result, error, setResult };
}
