import { useCallback, useEffect, useState } from "react";
import { PET_ACTIONS } from "@careix/shared";
import { getSpeciesInfo } from "@careix/shared";
import { PetScreenLayout } from "../components/PetScreenLayout";
import { StatBar } from "../components/StatBar";
import { ActionButton } from "../components/ActionButton";
import { PetHero } from "../components/PetHero";
import { DogAiPanel } from "../components/DogAiPanel";
import { AiSettingsModal } from "../components/AiSettingsModal";
import { useAuth } from "../context/AuthContext";
import { usePet } from "../hooks/usePet";
import { usePetChat } from "../hooks/usePetChat";
import { useSpeech } from "../hooks/useSpeech";
import { hasAiKey } from "../lib/aiSettings";

export function PetHome() {
  const { user, logout } = useAuth();
  const { pet, loading, error, loadPet, performAction } = usePet();
  const { messages, loading: chatLoading, error: chatError, sendMessage } =
    usePetChat(pet);
  const { speak, stop } = useSpeech();

  const [aiOpen, setAiOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadPet();
  }, [loadPet]);

  const info = pet ? getSpeciesInfo(pet.species) : null;
  const isDog = pet?.species === "dog";

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const handleAction = async (action: (typeof PET_ACTIONS)[number]) => {
    try {
      await performAction(action);
      const labels: Record<string, string> = {
        feed: "Afiyet olsun!",
        play: "Çok eğlendik!",
        clean: "Parıl parıl!",
        rest: "İyi uykular…",
        pet: "Mmm, okşama güzelmiş.",
        walk: "Harika bir yürüyüş!",
      };
      showToast(labels[action] ?? "Tamam!");
    } catch {
      /* usePet sets error */
    }
  };

  const handleAiSend = useCallback(
    async (text: string) => {
      const reply = await sendMessage(text);
      if (reply) {
        setSpeaking(true);
        speak(reply);
        const checkDone = () => {
          if (!window.speechSynthesis.speaking) {
            setSpeaking(false);
          } else {
            requestAnimationFrame(checkDone);
          }
        };
        setTimeout(checkDone, 100);
      }
    },
    [sendMessage, speak]
  );

  const handleTalkClick = () => {
    if (!hasAiKey()) {
      setSettingsOpen(true);
      return;
    }
    setAiOpen(true);
    if (messages.length === 0 && pet) {
      void handleAiSend("Merhaba! Kendini tanıt.");
    }
  };

  useEffect(() => () => stop(), [stop]);

  const actionDock = (
    <div className="careix-dock" data-testid="careix-actions">
      {PET_ACTIONS.map((action) => (
        <ActionButton
          key={action}
          action={action}
          compact
          disabled={loading}
          onClick={() => void handleAction(action)}
        />
      ))}
      {isDog && (
        <button
          type="button"
          className="careix-action-btn careix-action-btn--talk careix-action-btn--compact"
          disabled={loading || chatLoading}
          onClick={handleTalkClick}
          data-testid="careix-action-talk"
        >
          <span className="careix-action-btn__icon" aria-hidden>
            💬
          </span>
          <span className="careix-action-btn__label">Konuş</span>
        </button>
      )}
    </div>
  );

  return (
    <PetScreenLayout title="Careix" brand>
      <div className="careix-top-bar">
        <span className="careix-email">{user?.email}</span>
        <div className="careix-top-bar__actions">
          {isDog && (
            <button
              type="button"
              className="careix-link-btn"
              onClick={() => setSettingsOpen(true)}
            >
              AI
            </button>
          )}
          <button type="button" className="careix-link-btn" onClick={logout}>
            Çıkış
          </button>
        </div>
      </div>

      {loading && !pet && <p className="careix-hint">Yükleniyor…</p>}
      {error && <p className="careix-error">{error}</p>}

      {pet && info && (
        <>
          <PetHero pet={pet} species={info} actionDock={actionDock} />

          {toast && <div className="careix-toast">{toast}</div>}

          <div className="careix-stats-card">
            <h3 className="careix-stats-card__title">Durum</h3>
            <div className="careix-stats">
              <StatBar label="Açlık" value={pet.hunger} color="#ff8c42" />
              <StatBar label="Mutluluk" value={pet.happiness} color="#ff6b9d" />
              <StatBar label="Temizlik" value={pet.hygiene} color="#4ecdc4" />
              <StatBar label="Enerji" value={pet.energy} color="#7c5cff" />
            </div>
          </div>

          {isDog && (
            <>
              <DogAiPanel
                pet={pet}
                open={aiOpen}
                onClose={() => setAiOpen(false)}
                messages={messages}
                loading={chatLoading}
                error={chatError}
                onSend={(t) => void handleAiSend(t)}
                onOpenSettings={() => setSettingsOpen(true)}
                speaking={speaking}
              />
              <AiSettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
              />
            </>
          )}
        </>
      )}
    </PetScreenLayout>
  );
}
