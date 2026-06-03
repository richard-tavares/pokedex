<template>
  <div>
    <v-alert v-if="error" type="error" variant="tonal" class="ma-4" icon="mdi-alert-circle-outline">
      Não foi possível carregar este Pokémon.
      <template #append>
        <v-btn variant="text" size="small" @click="load">Tentar novamente</v-btn>
      </template>
    </v-alert>

    <PokemonDetails
      v-else
      :pokemon="pokemon"
      :loading="loading"
      @back="router.push('/')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPokemonDetails } from '@/api/pokeAPI'
import PokemonDetails from '@/components/PokemonDetails.vue'
import type { PokemonDetail } from '@/types/pokemon'
import { usePokedexFilters } from '@/composables/usePokedexFilters'

const route  = useRoute()
const router = useRouter()
const { cachedPokemonList, lastViewedId, getPokemonIdFromUrl } = usePokedexFilters()

const pokemon = ref<PokemonDetail | null>(null)
const loading = ref(true)
const error   = ref(false)

const currentId = computed(() => Number(route.params.id))

const currentIndex = computed(() =>
  cachedPokemonList.value.findIndex(p => getPokemonIdFromUrl(p.url) === currentId.value),
)

const prevId = computed(() =>
  currentIndex.value > 0
    ? getPokemonIdFromUrl(cachedPokemonList.value[currentIndex.value - 1].url)
    : null,
)

const nextId = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < cachedPokemonList.value.length - 1
    ? getPokemonIdFromUrl(cachedPokemonList.value[currentIndex.value + 1].url)
    : null,
)

function navigate(id: number) {
  lastViewedId.value = id
  router.push(`/pokemon/${id}`)
}

async function load() {
  loading.value = true
  error.value   = false
  const data = await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${currentId.value}/`)
  if (data) {
    pokemon.value = data
    document.title = `${data.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Pokédex`
  } else {
    error.value = true
  }
  loading.value = false
}

function handleKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft'  && prevId.value) navigate(prevId.value)
  if (e.key === 'ArrowRight' && nextId.value) navigate(nextId.value)
}

watch(() => route.params.id, load)

onMounted(() => {
  load()
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  document.title = 'Pokédex'
})
</script>
