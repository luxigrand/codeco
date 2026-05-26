import { useEffect } from "react";
import { PET_ACTIONS } from "@careix/shared";
import { getSpeciesInfo } from "@careix/shared";
import { PetScreenLayout } from "../components/PetScreenLayout";
import { StatBar } from "../components/StatBar";
import { ActionButton } from "../components/ActionButton";
import { useAuth } from "../context/AuthContext";
import { usePet } from "../hooks/usePet";

export function PetHome() {
  const { user, logout } = useAuth();
  const { pet, loading, error, loadPet, performAction } = usePet();

  useEffect(() => {
    loadPet();
  }, [loadPet]);

  const info = pet ? getSpeciesInfo(pet.species) : null;

  return (
    <PetScreenLayout title="Careix">
      <div className="careix-top-bar">
        <span className="careix-email">{user?.email}</span>
        <button type="button" className="careix-link-btn" onClick={logout}>
          Çıkış
        </button>
      </div>

      {loading && !pet && <p className="careix-hint">Yükleniyor...</p>}
      {error && <p className="careix-error">{error}</p>}

      {pet && (
        <>
          <div className="careix-pet-area" data-testid="careix-pet-area">
            <span className="careix-pet-area__emoji">{info?.emoji ?? "?"}</span>
            <h2 className="careix-pet-area__name">{pet.name}</h2>
            <p className="careix-pet-area__species">{info?.labelTr}</p>
          </div>

          <div className="careix-stats">
            <StatBar label="Açlık" value={pet.hunger} />
            <StatBar label="Mutluluk" value={pet.happiness} />
            <StatBar label="Temizlik" value={pet.hygiene} />
            <StatBar label="Enerji" value={pet.energy} />
          </div>

          <div className="careix-actions" data-testid="careix-actions">
            {PET_ACTIONS.map((action) => (
              <ActionButton
                key={action}
                action={action}
                disabled={loading}
                onClick={() => performAction(action)}
              />
            ))}
          </div>
        </>
      )}
    </PetScreenLayout>
  );
}
