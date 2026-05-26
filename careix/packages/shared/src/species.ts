import type { SpeciesInfo } from "./types";

export const SPECIES_LIST: SpeciesInfo[] = [
  {
    id: "bird",
    labelTr: "Kuş",
    emoji: "🐦",
    cardBg: "#c8f7c5",
    cardFg: "#1a1a1a",
    align: "left",
  },
  {
    id: "cat",
    labelTr: "Kedi",
    emoji: "🐱",
    cardBg: "#8b3a3a",
    cardFg: "#7fff7f",
    align: "right",
  },
  {
    id: "dog",
    labelTr: "Köpek",
    emoji: "🐶",
    cardBg: "#ff8c42",
    cardFg: "#6b2d8a",
    align: "left",
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
  },
  {
    id: "fish",
    labelTr: "Balık",
    emoji: "🐠",
    cardBg: "#6b3fa0",
    cardFg: "#ffffff",
    align: "right",
  },
  {
    id: "rabbit",
    labelTr: "Tavşan",
    emoji: "🐰",
    cardBg: "#4a3728",
    cardFg: "#ffffff",
    align: "left",
  },
  {
    id: "hamster",
    labelTr: "Hamster",
    emoji: "🐹",
    cardBg: "#f4d03f",
    cardFg: "#1a1a1a",
    align: "right",
  },
];

export function getSpeciesInfo(id: string): SpeciesInfo | undefined {
  return SPECIES_LIST.find((s) => s.id === id);
}
