export interface PokemonSpeciesVariety {
  is_default: boolean;
  pokemon: { name: string; url: string };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
  version: { name: string };
}

export interface PokemonGenus {
  genus: string;
  language: { name: string };
}

export interface EggGroup {
  name: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  evolution_chain: { url: string };
  varieties: PokemonSpeciesVariety[];
  flavor_text_entries: FlavorTextEntry[];
  genera: PokemonGenus[];
  capture_rate: number;
  gender_rate: number;
  egg_groups: EggGroup[];
}

export interface EvolutionDetail {
  trigger: { name: string };
  min_level: number | null;
  item: { name: string } | null;
  held_item: { name: string } | null;
  known_move: { name: string } | null;
  known_move_type: { name: string } | null;
  location: { name: string } | null;
  min_happiness: number | null;
  min_affection: number | null;
  min_beauty: number | null;
  time_of_day: string;
  needs_overworld_rain: boolean;
  turn_upside_down: boolean;
  trade_species: { name: string } | null;
  relative_physical_stats: number | null;
}

export interface ChainLink {
  species: { name: string; url: string };
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}
