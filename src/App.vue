<template>
  <v-app>
    <Navbar />

    <v-navigation-drawer v-if="mobile" v-model="showFilterDrawer" temporary location="right" width="288">
      <div class="d-flex align-center justify-space-between px-4 pt-4 pb-2">
        <span class="text-subtitle-1 font-weight-medium">Filtros</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="showFilterDrawer = false" />
      </div>
      <v-divider />
      <PokemonFilters mode="drawer" />
    </v-navigation-drawer>

    <v-main>
      <div class="main-content">
        <router-view />
      </div>
    </v-main>

    <Footer />
  </v-app>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'
import PokemonFilters from '@/components/PokemonFilters.vue'
import { usePokedexFilters } from '@/composables/usePokedexFilters'

const { mobile } = useDisplay()
const { showFilterDrawer } = usePokedexFilters()
</script>

<style>
* {
  font-family: 'Exo 2', sans-serif !important;
}

.main-content {
  min-height: calc(100dvh - var(--v-layout-top) - 72px);
}
</style>
