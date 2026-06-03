<template>
  <v-container fluid class="pa-0">
    <v-progress-linear v-if="loadingTypes" indeterminate color="primary" height="2" />

    <div v-if="pokemons.length === 0 && !loadingTypes" class="d-flex flex-column align-center justify-center py-16 text-medium-emphasis">
      <v-icon size="64" icon="mdi-magnify" />
      <p class="mt-3 text-body-1">Nenhum Pokémon encontrado</p>
    </div>

    <v-row dense class="ma-0 pa-2">
      <v-col v-for="pokemon in visiblePokemons" :key="pokemon.name" cols="6" sm="4" md="3" lg="2" xl="1">
        <v-card
          :id="`card-${getPokemonId(pokemon.url)}`"
          class="pokemon-card d-flex flex-column align-center pa-2"
          :class="{ 'pokemon-card--selected': getPokemonId(pokemon.url) === lastViewedId }"
          rounded="lg"
          flat
          @click="selectPokemon(pokemon.url)"
        >
          <img src="/pokeball.svg" alt="" aria-hidden="true" class="card-pokeball" />
          <span class="card-number text-medium-emphasis align-self-start">
            #{{ getPokemonId(pokemon.url).toString().padStart(3, '0') }}
          </span>
          <img :src="getSpriteUrl(pokemon.url)" :alt="pokemon.name" loading="lazy" class="pokemon-sprite" />
          <span class="card-name font-weight-medium text-center">
            {{ capitalize(pokemon.name) }}
          </span>
          <div class="card-types d-flex ga-1 justify-center mt-1">
            <TypeChip v-for="type in (typesMap.get(pokemon.name) ?? [])" :key="type.pt" :type="type" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div ref="sentinel" class="sentinel" />

    <div v-if="loadingMore" class="d-flex justify-center py-4">
      <v-progress-circular indeterminate color="primary" size="24" />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getPokemonDetails } from '@/api/pokeAPI'
import type { Pokemon } from '@/types/pokemon'
import typeInfoRaw from '@/assets/types-info.json'
import TypeChip from '@/components/TypeChip.vue'
import { usePokedexFilters } from '@/composables/usePokedexFilters'

const typeInfo = typeInfoRaw as Record<string, { pt: string; color: string; foto: string }>

const PAGE_SIZE = 48

const props = defineProps<{
  pokemons: Pokemon[]
  loadingTypes?: boolean
}>()

const router = useRouter()
const { lastViewedId, getPokemonIdFromUrl } = usePokedexFilters()
const sentinel = ref<HTMLElement | null>(null)
const visibleCount = ref(PAGE_SIZE)
const loadingMore = ref(false)
const typesMap = reactive(new Map<string, { pt: string; color: string; foto: string }[]>())

const visiblePokemons = computed(() => props.pokemons.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < props.pokemons.length)

watch(() => props.pokemons, () => { visibleCount.value = PAGE_SIZE })

watch(visiblePokemons, async (list) => {
  const missing = list.filter(p => !typesMap.has(p.name))
  if (!missing.length) return
  await Promise.all(missing.map(async p => {
    const detail = await getPokemonDetails(p.url)
    if (detail) typesMap.set(p.name, detail.types.map(t => typeInfo[t.type.name]).filter(Boolean))
  }))
}, { immediate: true })

function loadMore() {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  setTimeout(() => {
    visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, props.pokemons.length)
    loadingMore.value = false
  }, 300)
}

function selectPokemon(url: string) {
  const id = getPokemonId(url)
  lastViewedId.value = id
  router.push(`/pokemon/${id}`)
}

let observer: IntersectionObserver | null = null

onMounted(async () => {
  if (lastViewedId.value !== null) {
    const idx = props.pokemons.findIndex(p => getPokemonIdFromUrl(p.url) === lastViewedId.value)
    if (idx >= visibleCount.value) {
      visibleCount.value = Math.min(idx + PAGE_SIZE, props.pokemons.length)
    }
    await nextTick()
    document.getElementById(`card-${lastViewedId.value}`)?.scrollIntoView({ block: 'center' })
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMore()
  }, { rootMargin: '200px' })

  if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => observer?.disconnect())

const getPokemonId = (url: string) => Number(url.split('/')[6])
const getSpriteUrl = (url: string) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${url.split('/')[6]}.png`
const capitalize = (name: string) => name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
</script>

<style scoped>
.pokemon-card {
  aspect-ratio: 1;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}

.pokemon-card:hover {
  border-color: rgb(var(--v-theme-primary));
}

.pokemon-card--selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.card-pokeball {
  position: absolute;
  width: 100%;
  bottom: -25%;
  right: -25%;
  opacity: 0.1;
  transform: rotate(45deg);
  pointer-events: none;
}

.card-number {
  font-size: 11px;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.pokemon-sprite {
  flex: 1;
  min-height: 0;
  width: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.card-name {
  font-size: 15px;
  line-height: 1.2;
  position: relative;
  z-index: 1;
}

.card-types {
  position: relative;
  z-index: 1;
}

.sentinel {
  height: 1px;
}
</style>
