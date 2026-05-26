import { Router } from "express";
import { z } from "zod";
import { PET_ACTIONS, PET_SPECIES } from "@careix/shared";
import { prisma } from "../lib/prisma";
import { requireAuth, type AuthRequest } from "../lib/auth";
import { applyTick, applyAction, petToDto } from "../services/petTick";

const router = Router();

const createPetSchema = z.object({
  species: z.enum(PET_SPECIES),
  name: z.string().min(1, "İsim gerekli").max(32, "İsim çok uzun"),
});

async function getPetWithTick(userId: string) {
  const pet = await prisma.pet.findUnique({ where: { userId } });
  if (!pet) return null;

  const ticked = applyTick(pet);
  if (
    ticked.hunger !== pet.hunger ||
    ticked.happiness !== pet.happiness ||
    ticked.hygiene !== pet.hygiene ||
    ticked.energy !== pet.energy ||
    ticked.lastTickAt.getTime() !== pet.lastTickAt.getTime()
  ) {
    return prisma.pet.update({
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
  return pet;
}

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = createPetSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Geçersiz veri" });
    return;
  }

  const existing = await prisma.pet.findUnique({ where: { userId: req.userId! } });
  if (existing) {
    res.status(409).json({ error: "Zaten bir evcil hayvanınız var" });
    return;
  }

  const { species, name } = parsed.data;
  const pet = await prisma.pet.create({
    data: {
      userId: req.userId!,
      species,
      name,
    },
  });

  res.status(201).json(petToDto(pet));
});

router.get("/current", requireAuth, async (req: AuthRequest, res) => {
  const pet = await getPetWithTick(req.userId!);
  if (!pet) {
    res.status(404).json({ error: "Evcil hayvan bulunamadı" });
    return;
  }
  res.json(petToDto(pet));
});

router.post("/actions/:action", requireAuth, async (req: AuthRequest, res) => {
  const raw = req.params.action;
  const action = Array.isArray(raw) ? raw[0] : raw;
  if (!action || !PET_ACTIONS.includes(action as (typeof PET_ACTIONS)[number])) {
    res.status(400).json({ error: "Geçersiz aksiyon" });
    return;
  }

  let pet = await getPetWithTick(req.userId!);
  if (!pet) {
    res.status(404).json({ error: "Evcil hayvan bulunamadı" });
    return;
  }

  const updated = applyAction(pet, action);
  pet = await prisma.pet.update({
    where: { id: pet.id },
    data: {
      hunger: updated.hunger,
      happiness: updated.happiness,
      hygiene: updated.hygiene,
      energy: updated.energy,
      lastTickAt: updated.lastTickAt,
    },
  });

  res.json(petToDto(pet));
});

export default router;
