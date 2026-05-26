export const PET_SPECIES = [
  "bird",
  "cat",
  "dog",
  "fish",
  "rabbit",
  "hamster",
] as const;

export type PetSpecies = (typeof PET_SPECIES)[number];

export const PET_ACTIONS = ["feed", "play", "clean", "rest"] as const;

export type PetAction = (typeof PET_ACTIONS)[number];

export interface PetStats {
  hunger: number;
  happiness: number;
  hygiene: number;
  energy: number;
}

export interface SpeciesInfo {
  id: PetSpecies;
  labelTr: string;
  emoji: string;
  imageUrl?: string;
}

export interface PetDto {
  id: string;
  species: PetSpecies;
  name: string;
  hunger: number;
  happiness: number;
  hygiene: number;
  energy: number;
  lastTickAt: string;
}

export interface UserDto {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface MeResponse {
  user: UserDto;
  pet: PetDto | null;
}

export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreatePetBody {
  species: PetSpecies;
  name: string;
}

export interface ApiError {
  error: string;
}
