import type { PetAction } from "@careix/shared";

const ACTION_LABELS: Record<PetAction, string> = {
  feed: "Besle",
  play: "Oyna",
  clean: "Temizle",
  rest: "Dinlen",
};

interface ActionButtonProps {
  action: PetAction;
  disabled?: boolean;
  onClick: () => void;
}

export function ActionButton({ action, disabled, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      className="careix-action-btn"
      data-testid={`careix-action-${action}`}
      disabled={disabled}
      onClick={onClick}
    >
      {ACTION_LABELS[action]}
    </button>
  );
}
