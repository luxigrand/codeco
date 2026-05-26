import { useEffect, useRef, useState } from "react";
import type { AiChatMessage, PetDto } from "@careix/shared";
import { hasAiKey } from "../lib/aiSettings";

const QUICK_PHRASES = [
  "Merhaba!",
  "Nasılsın?",
  "Beni seviyor musun?",
  "Hav hav!",
];

interface DogAiPanelProps {
  pet: PetDto;
  open: boolean;
  onClose: () => void;
  messages: AiChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onOpenSettings: () => void;
  speaking: boolean;
}

export function DogAiPanel({
  pet,
  open,
  onClose,
  messages,
  loading,
  error,
  onSend,
  onOpenSettings,
  speaking,
}: DogAiPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="careix-ai-panel" data-testid="careix-ai-panel">
      <div className="careix-ai-panel__header">
        <div>
          <h3>{pet.name} konuşuyor</h3>
          <span className="careix-ai-panel__status">
            {speaking ? "🔊 Konuşuyor…" : loading ? "Düşünüyor…" : "Sesli yanıt açık"}
          </span>
        </div>
        <button type="button" className="careix-icon-btn" onClick={onClose} aria-label="Kapat">
          ✕
        </button>
      </div>

      {!hasAiKey() && (
        <div className="careix-ai-banner">
          <p>Köpeğin konuşması için API anahtarı gerekli.</p>
          <button type="button" className="careix-btn careix-btn--small" onClick={onOpenSettings}>
            Anahtar gir
          </button>
        </div>
      )}

      <div className="careix-ai-messages">
        {messages.length === 0 && (
          <p className="careix-ai-empty">
            {pet.name} ile sohbet et — cevaplar sesli okunur.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`careix-ai-bubble careix-ai-bubble--${m.role}`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="careix-ai-bubble careix-ai-bubble--assistant careix-ai-bubble--typing">
            …
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="careix-error careix-ai-error">{error}</p>}

      <div className="careix-ai-quick">
        {QUICK_PHRASES.map((phrase) => (
          <button
            key={phrase}
            type="button"
            className="careix-chip"
            disabled={loading}
            onClick={() => onSend(phrase)}
          >
            {phrase}
          </button>
        ))}
      </div>

      <form className="careix-ai-input-row" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${pet.name}'a bir şey söyle…`}
          disabled={loading}
        />
        <button
          type="submit"
          className="careix-btn careix-btn--primary"
          disabled={loading || !input.trim()}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}
