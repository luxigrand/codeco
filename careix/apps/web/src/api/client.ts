import type {
  AuthResponse,
  CreatePetBody,
  LoginBody,
  MeResponse,
  PetDto,
  RegisterBody,
  PetAction,
} from "@careix/shared";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

function getToken(): string | null {
  return localStorage.getItem("careix_token");
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem("careix_token", token);
  } else {
    localStorage.removeItem("careix_token");
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Bir hata oluştu");
  }
  return data as T;
}

export const api = {
  register: (body: RegisterBody) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: LoginBody) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => request<MeResponse>("/auth/me"),

  createPet: (body: CreatePetBody) =>
    request<PetDto>("/pets", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getCurrentPet: () => request<PetDto>("/pets/current"),

  performAction: (action: PetAction) =>
    request<PetDto>(`/pets/actions/${action}`, { method: "POST" }),
};
