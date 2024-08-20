<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <PokemonDetails :pokemon="selectedPokemon" :loading="loading" />
            </v-col>
            <v-col cols="12" md="6">
                <PokemonList :pokemons="filteredPokemons" :searchQuery="searchQuery" @select="selectPokemon" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { getPokemonList, getPokemonDetails } from '@/api/pokeAPI';
import PokemonList from '@/components/PokemonList.vue';
import PokemonDetails from '@/components/PokemonDetails.vue';
import type { Pokemon, PokemonDetail } from '@/types/pokemon';

const props = defineProps<{
    searchQuery: string;
}>();

const pokemons = ref<Pokemon[]>([]);
const selectedPokemon = ref<PokemonDetail | null>(null);
const loading = ref(false);

const fetchPokemons = async () => {
    pokemons.value = await getPokemonList();
};

const selectPokemon = async (pokemon: { url: string }) => {
    loading.value = true;
    try {
        selectedPokemon.value = await getPokemonDetails(pokemon.url);
    } finally {
        loading.value = false;
    }
};

const filteredPokemons = computed(() => {
    if (!props.searchQuery) return pokemons.value;
    const query = props.searchQuery.toLowerCase();
    return pokemons.value.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query)
    );
});

onMounted(() => {
    fetchPokemons();
});
</script>