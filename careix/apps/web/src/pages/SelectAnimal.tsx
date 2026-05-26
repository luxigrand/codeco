import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPECIES_LIST, type PetSpecies } from "@careix/shared";
import { PetScreenLayout } from "../components/PetScreenLayout";
import { AnimalCard } from "../components/AnimalCard";

export function SelectAnimal() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<PetSpecies | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    navigate("/onboarding/name", { state: { species: selected } });
  };

  return (
    <PetScreenLayout title="Hayvanını seç">
      <p className="careix-hint">Bakmak istediğin hayvanı seç.</p>
      <div className="careix-species-grid" data-testid="careix-species-grid">
        {SPECIES_LIST.map((species) => (
          <AnimalCard
            key={species.id}
            species={species}
            selected={selected === species.id}
            onSelect={() => setSelected(species.id)}
          />
        ))}
      </div>
      <button
        type="button"
        className="careix-btn"
        data-testid="careix-continue-species"
        disabled={!selected}
        onClick={handleContinue}
      >
        Devam
      </button>
    </PetScreenLayout>
  );
}
