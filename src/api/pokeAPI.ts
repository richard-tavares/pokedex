import axios from 'axios';
import { apiErrorAlert } from '@/mixins/sweetalert';
import type { Pokemon, PokemonDetail } from '@/types/pokemon';

const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    timeout: 10000,
});

interface PokemonListResponse {
    results: Pokemon[];
}

export const getPokemonList = async (limit = 1025): Promise<Pokemon[]> => {
    try {
        const response = await api.get<PokemonListResponse>(`/pokemon?offset=0&limit=${limit}`);
        return response.data.results;
    } catch (error) {
        console.error("Erro ao obter a lista de Pokémons:", error);
        apiErrorAlert('Erro ao obter a lista de Pokémons.');
        return [];
    }
};

export const getPokemonDetails = async (url: string): Promise<PokemonDetail | null> => {
    try {
        const response = await api.get<PokemonDetail>(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao obter os detalhes do Pokémon:", error);
        apiErrorAlert('Erro ao obter os detalhes do Pokémon.');
        return null;
    }
};
