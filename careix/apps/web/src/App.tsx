import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomeRedirect } from "./components/HomeRedirect";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { SelectAnimal } from "./pages/SelectAnimal";
import { NamePet } from "./pages/NamePet";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <SelectAnimal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/name"
            element={
              <ProtectedRoute>
                <NamePet />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
