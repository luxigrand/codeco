import type { Pet } from "@prisma/client";

const STAT_KEYS = ["hunger", "happiness", "hygiene", "energy"] as const;
type StatKey = (typeof STAT_KEYS)[number];

/** Stats decay per hour (each stat). */
const DECAY_PER_HOUR = 5;

/** Action deltas: stat -> change */
export const ACTION_DELTAS: Record<
  string,
  Partial<Record<StatKey, number>>
> = {
  feed: { hunger: 25, happiness: 5 },
  play: { happiness: 25, energy: -10 },
  clean: { hygiene: 25, happiness: 5 },
  rest: { energy: 25, hunger: -5 },
  pet: { happiness: 18, energy: -3 },
  walk: { happiness: 20, energy: -18, hygiene: -8, hunger: -8 },
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function applyTick(pet: Pet): Pet {
  const now = Date.now();
  const last = pet.lastTickAt.getTime();
  const hoursElapsed = Math.max(0, (now - last) / (1000 * 60 * 60));

  if (hoursElapsed < 0.01) {
    return pet;
  }

  const decay = DECAY_PER_HOUR * hoursElapsed;

  return {
    ...pet,
    hunger: clamp(pet.hunger - decay),
    happiness: clamp(pet.happiness - decay),
    hygiene: clamp(pet.hygiene - decay),
    energy: clamp(pet.energy - decay),
    lastTickAt: new Date(now),
  };
}

export function applyAction(pet: Pet, action: string): Pet {
  const deltas = ACTION_DELTAS[action];
  if (!deltas) {
    return pet;
  }

  let updated = { ...pet };
  for (const key of STAT_KEYS) {
    const delta = deltas[key];
    if (delta !== undefined) {
      updated[key] = clamp(updated[key] + delta);
    }
  }
  updated.lastTickAt = new Date();
  return updated;
}

export function petToDto(pet: Pet) {
  return {
    id: pet.id,
    species: pet.species,
    name: pet.name,
    hunger: pet.hunger,
    happiness: pet.happiness,
    hygiene: pet.hygiene,
    energy: pet.energy,
    lastTickAt: pet.lastTickAt.toISOString(),
  };
}
