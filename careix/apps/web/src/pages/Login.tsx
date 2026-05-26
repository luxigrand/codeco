import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PetScreenLayout } from "../components/PetScreenLayout";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PetScreenLayout title="Careix — Giriş">
      <form
        className="careix-form"
        data-testid="careix-login-form"
        onSubmit={handleSubmit}
      >
        {error && <p className="careix-error">{error}</p>}
        <label className="careix-field">
          E-posta
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="careix-field">
          Şifre
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <button type="submit" className="careix-btn" disabled={submitting}>
          {submitting ? "..." : "Giriş yap"}
        </button>
        <p className="careix-link-row">
          Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
        </p>
      </form>
    </PetScreenLayout>
  );
}
