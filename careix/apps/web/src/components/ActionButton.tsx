import type { CSSProperties } from "react";
import type { PetAction } from "@careix/shared";

const ACTION_META: Record<
  PetAction,
  { label: string; icon: string; accent: string }
> = {
  feed: { label: "Besle", icon: "🍖", accent: "#ff8c42" },
  play: { label: "Oyna", icon: "🎾", accent: "#7c5cff" },
  clean: { label: "Yıka", icon: "🛁", accent: "#4ecdc4" },
  rest: { label: "Uyu", icon: "💤", accent: "#6b8cce" },
  pet: { label: "Okşa", icon: "🤚", accent: "#ff6b9d" },
  walk: { label: "Gezdir", icon: "🦮", accent: "#95d86e" },
};

interface ActionButtonProps {
  action: PetAction;
  disabled?: boolean;
  onClick: () => void;
  compact?: boolean;
}

export function ActionButton({
  action,
  disabled,
  onClick,
  compact,
}: ActionButtonProps) {
  const meta = ACTION_META[action];
  return (
    <button
      type="button"
      className={`careix-action-btn ${compact ? "careix-action-btn--compact" : ""}`}
      data-testid={`careix-action-${action}`}
      disabled={disabled}
      onClick={onClick}
      style={{ "--action-accent": meta.accent } as CSSProperties}
    >
      <span className="careix-action-btn__icon" aria-hidden>
        {meta.icon}
      </span>
      <span className="careix-action-btn__label">{meta.label}</span>
    </button>
  );
}
