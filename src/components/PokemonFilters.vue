<template>
  <div v-if="mode === 'bar'" class="d-flex align-center ga-3 px-4 py-2 w-100">

    <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" density="compact" placeholder="Pesquisar" rounded="lg" variant="solo-filled" flat hide-details clearable class="filter-search" />

    <v-select v-model="selectedGens" :items="genItems" multiple label="Geração" density="compact" variant="solo-filled" flat hide-details rounded="lg" class="filter-select">
      <template #selection="{ item, index }">
        <span v-if="index === 0" class="text-body-2 text-truncate">
          {{ selectedGens.length > 1 ? `${selectedGens.length} gerações` : item.title }}
        </span>
      </template>
      <template #item="{ props }">
        <v-list-item v-bind="props">
          <template #append="{ isSelected }">
            <v-checkbox-btn :model-value="isSelected" density="compact" />
          </template>
        </v-list-item>
      </template>
    </v-select>

    <v-select v-model="selectedTypes" :items="typeItems" multiple label="Tipo" density="compact" variant="solo-filled" flat hide-details rounded="lg" class="filter-select">
      <template #selection="{ item, index }">
        <span v-if="index === 0" class="text-body-2 text-truncate">
          {{ selectedTypes.length > 1 ? `${selectedTypes.length} tipos` : item.title }}
        </span>
      </template>
      <template #item="{ item, props }">
        <v-list-item v-bind="props">
          <template #prepend>
            <v-img :src="typeInfoMap[item.value as string]?.foto" :alt="item.title" width="22" height="22" class="mr-2 flex-shrink-0" />
          </template>
          <template #append="{ isSelected }">
            <v-checkbox-btn :model-value="isSelected" density="compact" />
          </template>
        </v-list-item>
      </template>
    </v-select>

    <v-btn v-if="activeFilterCount > 0" variant="tonal" color="white" size="small" class="flex-shrink-0" @click="clearFilters">
      <v-icon start size="16">mdi-filter-remove</v-icon>
      Limpar filtros ({{ activeFilterCount }})
    </v-btn>
  </div>

  <div v-else class="d-flex flex-column ga-5 pa-4">
    <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" density="compact" label="Pesquisar Pokémon" variant="solo-filled" flat hide-details clearable />

    <div>
      <p class="text-caption text-medium-emphasis text-uppercase mb-2">Geração</p>
      <v-select v-model="selectedGens" :items="genItems" multiple label="Selecionar gerações" density="compact" variant="solo-filled" flat hide-details rounded="lg">
        <template #item="{ props }">
          <v-list-item v-bind="props">
            <template #append="{ isSelected }">
              <v-checkbox-btn :model-value="isSelected" density="compact" />
            </template>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <div>
      <p class="text-caption text-medium-emphasis text-uppercase mb-2">Tipo</p>
      <v-select v-model="selectedTypes" :items="typeItems" multiple label="Selecionar tipos" density="compact" variant="solo-filled" flat hide-details rounded="lg">
        <template #selection="{ item, index }">
          <span v-if="index === 0" class="text-body-2 text-truncate">
            {{ selectedTypes.length > 1 ? `${selectedTypes.length} tipos` : item.title }}
          </span>
        </template>
        <template #item="{ item, props }">
          <v-list-item v-bind="props">
            <template #prepend>
              <v-img :src="typeInfoMap[item.value as string]?.foto" :alt="item.title" width="22" height="22" class="mr-2 flex-shrink-0" />
            </template>
            <template #append="{ isSelected }">
              <v-checkbox-btn :model-value="isSelected" density="compact" />
            </template>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <v-btn v-if="activeFilterCount > 0" variant="tonal" color="white" @click="clearFilters">
      <v-icon start size="16">mdi-filter-remove</v-icon>
      Limpar filtros ({{ activeFilterCount }})
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import type { TypeInfoMap } from '@/types/type'
import typeInfo from '@/assets/types-info.json'
import { usePokedexFilters } from '@/composables/usePokedexFilters'

defineProps<{ mode?: 'bar' | 'drawer' }>()

const { GENERATIONS, searchQuery, selectedGens, selectedTypes, activeFilterCount, clearFilters } = usePokedexFilters()

const typeInfoMap = typeInfo as TypeInfoMap
const genItems = GENERATIONS.map(g => ({ title: `${g.gen}ª Geração`, value: g.gen }))
const typeItems = Object.entries(typeInfoMap).map(([key, info]) => ({ title: info.pt, value: key })).sort((a, b) => a.title.localeCompare(b.title, 'pt'))
</script>

<style scoped>
.filter-search {
  min-width: 160px;
  max-width: 220px;
}

.filter-select {
  min-width: 140px;
  max-width: 190px;
}

@media (min-width: 1280px) {
  .filter-search {
    min-width: 220px;
    max-width: 320px;
  }

  .filter-select {
    min-width: 200px;
    max-width: 280px;
  }
}
</style>
