import { useEffect, useState } from "react";
import { loadAiSettings, saveAiSettings } from "../lib/aiSettings";

interface AiSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function AiSettingsModal({ open, onClose }: AiSettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [baseUrl, setBaseUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      const s = loadAiSettings();
      setApiKey(s.apiKey);
      setModel(s.model);
      setBaseUrl(s.baseUrl);
      setSaved(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAiSettings({ apiKey, model, baseUrl });
    setSaved(true);
    setTimeout(onClose, 600);
  };

  return (
    <div className="careix-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="careix-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="ai-settings-title"
      >
        <h2 id="ai-settings-title" className="careix-modal__title">
          AI Ayarları
        </h2>
        <p className="careix-modal__hint">
          OpenAI API anahtarın yalnızca tarayıcında saklanır; sunucu sadece
          isteği iletir.
        </p>
        <form className="careix-form" onSubmit={handleSave}>
          <label className="careix-field">
            API anahtarı
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
            />
          </label>
          <label className="careix-field">
            Model
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o-mini"
            />
          </label>
          <label className="careix-field">
            Base URL (isteğe bağlı)
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
          </label>
          <div className="careix-modal__actions">
            <button type="button" className="careix-btn careix-btn--ghost" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="careix-btn careix-btn--primary">
              {saved ? "Kaydedildi ✓" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
