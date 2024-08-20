<template>
    <v-card v-if="pokemon" rounded="lg" class="pa-2 ma-0 pokemon-details text-center" outlined>
        <v-card-title class="text-h6">{{ pokemon.name }}</v-card-title>
        <v-img class="pokemon-picture" :src="pokemon.sprites.other['official-artwork'].front_default" :alt="pokemon.name" />
        <v-chip v-for="type in formattedTypes" :key="type.pt" class="ma-1" :color="type.color" text-color="white">
            <v-img :src="type.foto" class="type-icon" />
            {{ type.pt }}
        </v-chip>
        <v-row class="justify-center">
            <v-col cols="6">
                <p>Altura: {{ heightInMeters }} m</p>
            </v-col>
            <v-col cols="6">
                <p>Peso: {{ weightInKilograms }} kg</p>
            </v-col>
        </v-row>
    </v-card>
    <v-skeleton-loader v-if="loading" class="pa-3">
        <template v-slot:default>
            <v-card>
                <v-card-title>Carregando...</v-card-title>
            </v-card>
        </template>
    </v-skeleton-loader>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';
import type { PokemonDetail } from '@/types/pokemon';
import type { TypeInfoMap } from '@/types/type';
import typeInfo from '@/assets/types-info.json';

const props = defineProps<{
    pokemon: PokemonDetail | null;
    loading: boolean;
}>();

const heightInMeters = computed(() => {
    return props.pokemon ? (props.pokemon.height / 10).toFixed(1) : 'N/A';
});

const weightInKilograms = computed(() => {
    return props.pokemon ? (props.pokemon.weight / 10).toFixed(1) : 'N/A';
});

const typeInfoMap = typeInfo as TypeInfoMap;

const formattedTypes = computed(() => {
    if (props.pokemon) {
        return props.pokemon.types.map(type => {
            const typeName = type.type.name as keyof TypeInfoMap;
            const typeInfoData = typeInfoMap[typeName];
            return {
                ...typeInfoData,
                pt: typeInfoData.pt,
                foto: typeInfoData.foto
            };
        });
    }
    return [];
});
</script>

<style scoped>
.pokemon-details {
    height: 24rem;
    border: solid 3px #921616;
    background-color: #111;
}

.pokemon-picture {
    max-height: 15rem;
}

.type-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}

@media (max-width: 768px) {
    .pokemon-details {
        height: 20rem;
    }

    .pokemon-picture {
        height: 10rem;
    }
}
</style>
