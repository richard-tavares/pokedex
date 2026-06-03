<template>
  <div class="pokemon-header position-relative d-flex flex-column align-center">
    <v-btn icon="mdi-creation" variant="text" size="large" :color="showShiny ? 'yellow' : 'white'" class="btn-shiny position-absolute" @click="emit('update:showShiny', !showShiny)" />

    <v-img :src="artwork" :alt="pokemon.name" width="450" height="450" class="mx-auto flex-grow-0" />

    <p class="text-medium-emphasis text-caption mt-2 mb-0" style="line-height: 1">
      #{{ String(pokemon.id).padStart(3, '0') }}
    </p>
    <h1 class="text-h5 font-weight-bold mt-1 mb-2">{{ capitalize(pokemon.name) }}</h1>

    <div class="d-flex ga-2 flex-wrap justify-center mb-4">
      <TypeChip v-for="type in formattedTypes" :key="type.pt" :type="type" />
    </div>

    <v-divider class="d-md-none w-100 mt-4" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PokemonDetail } from '@/types/pokemon'
import type { TypeInfoMap } from '@/types/type'
import typeInfo from '@/assets/types-info.json'
import TypeChip from '@/components/TypeChip.vue'

const props = defineProps<{
  pokemon: PokemonDetail
  showShiny: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'update:showShiny', val: boolean): void
}>()

const typeInfoMap = typeInfo as TypeInfoMap

const formattedTypes = computed(() =>
  props.pokemon.types.map(t => typeInfoMap[t.type.name as keyof TypeInfoMap]),
)

const artwork = computed(() => {
  const art = props.pokemon.sprites.other['official-artwork']
  return props.showShiny ? art.front_shiny : art.front_default
})

const capitalize = (name: string) =>
  name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
</script>

<style scoped>
.btn-shiny {
  top: 12px;
  right: 12px;
  z-index: 1;
}

@media (min-width: 960px) {
  .pokemon-header {
    justify-content: center;
  }
}
</style>
