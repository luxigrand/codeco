import { useCallback, useState } from "react";
import type { PetAction, PetDto } from "@careix/shared";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function usePet() {
  const { refresh } = useAuth();
  const [pet, setPet] = useState<PetDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCurrentPet();
      setPet(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yüklenemedi");
      setPet(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const performAction = useCallback(
    async (action: PetAction) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.performAction(action);
        setPet(data);
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Aksiyon başarısız");
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  return { pet, setPet, loading, error, loadPet, performAction };
}
