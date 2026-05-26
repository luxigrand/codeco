import { Router } from "express";
import { z } from "zod";
import type { AiChatResponse } from "@careix/shared";
import { requireAuth } from "../lib/auth";

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(500),
  petName: z.string().min(1).max(32),
  species: z.string(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(12)
    .optional(),
});

router.post("/chat", requireAuth, async (req, res) => {
  const apiKey = req.headers["x-openai-api-key"];
  if (typeof apiKey !== "string" || !apiKey.startsWith("sk-")) {
    res.status(400).json({ error: "OpenAI API anahtarı gerekli (sk-...)" });
    return;
  }

  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Geçersiz veri" });
    return;
  }

  const { message, petName, species, history = [] } = parsed.data;
  const baseUrl =
    (typeof req.headers["x-openai-base-url"] === "string"
      ? req.headers["x-openai-base-url"]
      : process.env.OPENAI_BASE_URL) ?? "https://api.openai.com/v1";

  const model =
    (typeof req.headers["x-openai-model"] === "string"
      ? req.headers["x-openai-model"]
      : process.env.OPENAI_MODEL) ?? "gpt-4o-mini";

  const systemPrompt =
    species === "dog"
      ? `Sen ${petName} adında sevimli, oyuncu bir köpeksin. Türkçe konuş. Kısa cümleler (1-3), bazen hav hav de. Sahibinle samimi ol; duygularını anlat. Emoji kullanma.`
      : `Sen ${petName} adında bir ${species} evcil hayvansın. Türkçe, kısa ve sevimli cevaplar ver.`;

  try {
    const openaiRes = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 180,
        temperature: 0.9,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
        ],
      }),
    });

    const data = (await openaiRes.json()) as {
      error?: { message?: string };
      choices?: { message?: { content?: string } }[];
    };

    if (!openaiRes.ok) {
      res.status(502).json({
        error: data.error?.message ?? "AI servisi yanıt vermedi",
      });
      return;
    }

    const reply =
      data.choices?.[0]?.message?.content?.trim() ??
      "Hav hav… Şu an bir şey söyleyemiyorum.";

    res.json({ reply } satisfies AiChatResponse);
  } catch {
    res.status(502).json({ error: "AI bağlantısı kurulamadı" });
  }
});

export default router;
