<template>
  <v-sheet rounded="lg" class="pokemon-list pa-3">
    <v-row>
      <v-col v-for="pokemon in filteredPokemons" :key="pokemon.name" cols="6" sm="4">
        <v-card class="pokemon-card pa-2" outlined @click="selectPokemon(pokemon)">
          <v-card-title class="text-center text-h6">{{ pokemon.name }}</v-card-title>
          <v-img class="pokemon-sprite" :src="getPokemonImageUrl(pokemon.url)" :alt="pokemon.name" />
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Pokemon } from '@/types/pokemon';

const props = defineProps<{
  pokemons: Pokemon[];
  searchQuery: string;
}>();

const filteredPokemons = computed(() => {
  if (!props.searchQuery) return props.pokemons;
  const query = props.searchQuery.toLowerCase();
  return props.pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(query)
  );
});

const emit = defineEmits<{
  (e: 'select', pokemon: { url: string }): void;
}>();

const getPokemonImageUrl = (url: string) => {
  const id = url.split('/')[6];
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

const selectPokemon = (pokemon: { url: string }) => {
  emit('select', pokemon);
};
</script>

<style scoped>
.pokemon-list {
  height: 24rem;
  overflow-y: auto;
  overflow-x: hidden;
  border: solid 3px #921616;
  background-color: #111;
}

.pokemon-card:hover {
  background-color: #921616;
  transform: scale(1.1);
}

::-webkit-scrollbar {
  display: none;
}

.scrollable-element {
  scrollbar-width: none;
}

.scrollable-element {
  overflow: hidden;
}

.pokemon-sprite {
  max-height: 5rem;
}

@media (min-width: 1400px) {
  .pokemon-list {
    height: 45rem;
  }

  .pokemon-sprite {
    height: 100%;
  }
}

@media (max-width: 768px) {
  .pokemon-list {
    max-height: 25rem;
  }
}
</style>
