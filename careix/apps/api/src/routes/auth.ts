import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, signToken, type AuthRequest } from "../lib/auth";
import { applyTick, petToDto } from "../services/petTick";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

router.post("/register", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Geçersiz veri" });
    return;
  }

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "Bu e-posta zaten kayıtlı" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  const token = signToken(user.id);
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email },
  });
});

router.post("/login", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Geçersiz veri" });
    return;
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: "E-posta veya şifre hatalı" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "E-posta veya şifre hatalı" });
    return;
  }

  const token = signToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email },
  });
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { pet: true },
  });

  if (!user) {
    res.status(404).json({ error: "Kullanıcı bulunamadı" });
    return;
  }

  let pet = user.pet;
  if (pet) {
    const ticked = applyTick(pet);
    if (
      ticked.hunger !== pet.hunger ||
      ticked.happiness !== pet.happiness ||
      ticked.hygiene !== pet.hygiene ||
      ticked.energy !== pet.energy ||
      ticked.lastTickAt.getTime() !== pet.lastTickAt.getTime()
    ) {
      pet = await prisma.pet.update({
        where: { id: pet.id },
        data: {
          hunger: ticked.hunger,
          happiness: ticked.happiness,
          hygiene: ticked.hygiene,
          energy: ticked.energy,
          lastTickAt: ticked.lastTickAt,
        },
      });
    }
  }

  res.json({
    user: { id: user.id, email: user.email },
    pet: pet ? petToDto(pet) : null,
  });
});

export default router;
