<template>
  <v-app-bar density="comfortable" color="primary" elevation="0" :extension-height="showDesktopFilters && mdAndUp ? 56 : 0">
    <v-img src="/src/assets/logo.png" max-width="40" height="40" class="ml-2 mr-0 clickable" alt="Logo" @click="router.push('/')" />
    <v-app-bar-title class="font-weight-bold clickable" @click="router.push('/')">Pokédex</v-app-bar-title>


    <v-btn v-if="!isDetailPage" variant="tonal" size="small" class="d-none d-md-flex mr-2" :opacity="showDesktopFilters ? 1 : 0.6" @click="showDesktopFilters = !showDesktopFilters">
      <v-icon start size="16">mdi-filter-variant</v-icon>
      Filtros
      <v-chip v-if="activeFilterCount > 0" size="x-small" color="primary" class="ml-1">
        {{ activeFilterCount }}
      </v-chip>
      <v-icon end size="16">{{ showDesktopFilters ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </v-btn>
    <v-btn v-if="!isDetailPage" icon class="d-md-none mr-1" variant="text" @click="showFilterDrawer = !showFilterDrawer">
      <v-badge :content="activeFilterCount" :model-value="activeFilterCount > 0" color="white" floating>
        <v-icon>mdi-filter-variant</v-icon>
      </v-badge>
    </v-btn>

    <template v-if="!isDetailPage && showDesktopFilters && mdAndUp" #extension>
      <div class="filter-bar w-100">
        <PokemonFilters mode="bar" />
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter, useRoute } from 'vue-router'
import PokemonFilters from '@/components/PokemonFilters.vue'
import { usePokedexFilters } from '@/composables/usePokedexFilters'

const { mdAndUp } = useDisplay()
const { showFilterDrawer, showDesktopFilters, activeFilterCount } = usePokedexFilters()
const router = useRouter()
const route = useRoute()

const isDetailPage = computed(() => route.name === 'pokemon-detail' || route.path.startsWith('/pokemon/'))
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

:deep(.v-toolbar-title) {
  margin-inline-start: 4px !important;
}

.filter-bar {
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
