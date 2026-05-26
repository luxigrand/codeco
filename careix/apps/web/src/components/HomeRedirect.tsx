import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PetHome } from "../pages/PetHome";

export function HomeRedirect() {
  const { pet, loading } = useAuth();

  if (loading) {
    return <p className="careix-hint careix-center">Yükleniyor...</p>;
  }

  if (!pet) {
    return <Navigate to="/onboarding" replace />;
  }

  return <PetHome />;
}
