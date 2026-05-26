const KEY_API = "careix_openai_api_key";
const KEY_MODEL = "careix_openai_model";
const KEY_BASE = "careix_openai_base_url";

export interface AiSettings {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export function loadAiSettings(): AiSettings {
  return {
    apiKey: localStorage.getItem(KEY_API) ?? "",
    model: localStorage.getItem(KEY_MODEL) ?? "gpt-4o-mini",
    baseUrl: localStorage.getItem(KEY_BASE) ?? "",
  };
}

export function saveAiSettings(settings: AiSettings): void {
  if (settings.apiKey) {
    localStorage.setItem(KEY_API, settings.apiKey);
  } else {
    localStorage.removeItem(KEY_API);
  }
  localStorage.setItem(KEY_MODEL, settings.model || "gpt-4o-mini");
  if (settings.baseUrl) {
    localStorage.setItem(KEY_BASE, settings.baseUrl);
  } else {
    localStorage.removeItem(KEY_BASE);
  }
}

export function hasAiKey(): boolean {
  const key = localStorage.getItem(KEY_API);
  return Boolean(key && key.startsWith("sk-"));
}
