import type { SpeciesInfo } from "@careix/shared";

interface AnimalCardProps {
  species: SpeciesInfo;
  selected: boolean;
  onSelect: () => void;
}

export function AnimalCard({ species, selected, onSelect }: AnimalCardProps) {
  return (
    <button
      type="button"
      className={`careix-animal-card ${selected ? "careix-animal-card--selected" : ""}`}
      data-testid={`careix-species-${species.id}`}
      onClick={onSelect}
      style={{
        background: species.cardBg,
        color: species.cardFg,
        textAlign: species.align,
      }}
    >
      <span className="careix-animal-card__emoji">{species.emoji}</span>
      <span className="careix-animal-card__label">{species.labelTr}</span>
    </button>
  );
}
