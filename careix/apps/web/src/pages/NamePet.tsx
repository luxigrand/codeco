import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import type { PetSpecies } from "@careix/shared";
import { getSpeciesInfo } from "@careix/shared";
import { PetScreenLayout } from "../components/PetScreenLayout";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function NamePet() {
  const { state } = useLocation() as { state?: { species?: PetSpecies } };
  const species = state?.species;
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!species) {
    return <Navigate to="/onboarding" replace />;
  }

  const info = getSpeciesInfo(species);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.createPet({ species, name: name.trim() });
      await refresh();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Oluşturulamadı");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PetScreenLayout title="İsim ver">
      <div className="careix-pet-preview" data-testid="careix-name-preview">
        <span className="careix-pet-preview__emoji">{info?.emoji ?? "?"}</span>
        <span>{info?.labelTr ?? species}</span>
      </div>
      <form className="careix-form" onSubmit={handleSubmit}>
        {error && <p className="careix-error">{error}</p>}
        <label className="careix-field">
          Evcil hayvanının adı
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn. Cici"
            required
            maxLength={32}
            data-testid="careix-pet-name-input"
          />
        </label>
        <button type="submit" className="careix-btn" disabled={submitting}>
          {submitting ? "..." : "Başla"}
        </button>
      </form>
    </PetScreenLayout>
  );
}
