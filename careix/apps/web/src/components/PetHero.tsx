import type { PetDto, SpeciesInfo } from "@careix/shared";
import type { ReactNode } from "react";

interface PetHeroProps {
  pet: PetDto;
  species: SpeciesInfo;
  actionDock: ReactNode;
}

export function PetHero({ pet, species, actionDock }: PetHeroProps) {
  const hasImage = Boolean(species.imageUrl);

  return (
    <section
      className={`careix-hero ${hasImage ? "careix-hero--photo" : ""}`}
      data-testid="careix-pet-hero"
      style={
        {
          "--species-bg": species.cardBg,
          "--species-fg": species.cardFg,
        } as React.CSSProperties
      }
    >
      {hasImage ? (
        <img
          className="careix-hero__img"
          src={species.imageUrl}
          alt={pet.name}
        />
      ) : (
        <div className="careix-hero__emoji-wrap">
          <span className="careix-hero__emoji">{species.emoji}</span>
        </div>
      )}
      <div className="careix-hero__gradient" />
      <div className="careix-hero__badge">{species.labelTr}</div>
      <div className="careix-hero__info">
        <h2 className="careix-hero__name">{pet.name}</h2>
      </div>
      <div className="careix-hero__dock">{actionDock}</div>
    </section>
  );
}
