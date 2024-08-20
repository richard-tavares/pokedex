export interface Pokemon {
    name: string;
    url: string;
}

export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        dream_world: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: { type: { name: string } }[];
}
