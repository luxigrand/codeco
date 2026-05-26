import type { SpeciesInfo } from "./types";

export const SPECIES_LIST: SpeciesInfo[] = [
  { id: "bird", labelTr: "Kuş", emoji: "🐦" },
  { id: "cat", labelTr: "Kedi", emoji: "🐱" },
  { id: "dog", labelTr: "Köpek", emoji: "🐶" },
  { id: "fish", labelTr: "Balık", emoji: "🐠" },
  { id: "rabbit", labelTr: "Tavşan", emoji: "🐰" },
  { id: "hamster", labelTr: "Hamster", emoji: "🐹" },
];

export function getSpeciesInfo(id: string): SpeciesInfo | undefined {
  return SPECIES_LIST.find((s) => s.id === id);
}
