import { useCallback, useState } from "react";
import type { AiChatMessage, AiChatResponse, PetDto } from "@careix/shared";
import { loadAiSettings } from "../lib/aiSettings";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export function usePetChat(pet: PetDto | null) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string): Promise<string | null> => {
      if (!pet) return null;
      const trimmed = text.trim();
      if (!trimmed) return null;

      const settings = loadAiSettings();
      if (!settings.apiKey.startsWith("sk-")) {
        setError("Önce OpenAI API anahtarını ayarla.");
        return null;
      }

      setError(null);
      setLoading(true);
      const userMsg: AiChatMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const token = localStorage.getItem("careix_token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          "X-OpenAI-Api-Key": settings.apiKey,
          "X-OpenAI-Model": settings.model,
        };
        if (settings.baseUrl) {
          (headers as Record<string, string>)["X-OpenAI-Base-Url"] =
            settings.baseUrl;
        }
        if (token) {
          (headers as Record<string, string>)["Authorization"] =
            `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}/ai/chat`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            message: trimmed,
            petName: pet.name,
            species: pet.species,
            history: messages.slice(-10),
          }),
        });

        const data = (await res.json()) as AiChatResponse & { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "AI yanıt vermedi");
        }

        const assistantMsg: AiChatMessage = {
          role: "assistant",
          content: data.reply,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        return data.reply;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bir hata oluştu";
        setError(msg);
        setMessages((prev) => prev.slice(0, -1));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [pet, messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}
