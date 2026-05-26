import { useCallback, useRef } from "react";

export function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        return;
      }
      stop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "tr-TR";
      utterance.rate = 1.05;
      utterance.pitch = 1.15;
      const voices = window.speechSynthesis.getVoices();
      const tr =
        voices.find((v) => v.lang.startsWith("tr")) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (tr) utterance.voice = tr;
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [stop]
  );

  return { speak, stop };
}
