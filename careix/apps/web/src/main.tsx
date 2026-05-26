import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initSupabaseSession } from "@/utils/supabase/session";
import "./styles/theme.css";

void initSupabaseSession();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
