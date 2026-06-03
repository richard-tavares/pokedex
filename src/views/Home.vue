<template>
  <div>
    <v-progress-linear v-if="loadingStats" :model-value="statsProgress" color="primary" height="2" />
    <PokemonList :pokemons="sortedPokemons" :loading-types="loadingTypes" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { getPokemonList, getPokemonDetails, getPokemonByType } from '@/api/pokeAPI'
import PokemonList from '@/components/PokemonList.vue'
import type { Pokemon } from '@/types/pokemon'
import { usePokedexFilters } from '@/composables/usePokedexFilters'

const {
  searchQuery, selectedGens, selectedTypes, sortBy,
  cachedPokemonList, GENERATIONS, isStatSort, getPokemonIdFromUrl,
} = usePokedexFilters()

const typeFilteredNames = ref<Set<string> | null>(null)
const loadingTypes = ref(false)
const loadingStats = ref(false)
const statsProgress = ref(0)

const statsCache = reactive(new Map<number, Record<string, number>>())

const genFiltered = computed(() => {
  if (!selectedGens.value.length) return cachedPokemonList.value
  return cachedPokemonList.value.filter(p => {
    const id = getPokemonIdFromUrl(p.url)
    return selectedGens.value.some(gen => {
      const g = GENERATIONS.find(g => g.gen === gen)
      return g && id >= g.min && id <= g.max
    })
  })
})

const filteredPokemons = computed(() => {
  let result = genFiltered.value
  if (typeFilteredNames.value) result = result.filter(p => typeFilteredNames.value!.has(p.name))
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }
  return result
})

const sortedPokemons = computed((): Pokemon[] => {
  const list = filteredPokemons.value
  if (sortBy.value === 'number') return list
  if (sortBy.value === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name))
  return [...list].sort((a, b) => {
    const sa = statsCache.get(getPokemonIdFromUrl(a.url))
    const sb = statsCache.get(getPokemonIdFromUrl(b.url))
    return (sb?.[sortBy.value] ?? 0) - (sa?.[sortBy.value] ?? 0)
  })
})

async function loadStats(pokemons: Pokemon[]) {
  const missing = pokemons.filter(p => !statsCache.has(getPokemonIdFromUrl(p.url)))
  if (!missing.length) return

  loadingStats.value = true
  statsProgress.value = 0
  const BATCH = 50

  for (let i = 0; i < missing.length; i += BATCH) {
    await Promise.all(
      missing.slice(i, i + BATCH).map(async p => {
        const id = getPokemonIdFromUrl(p.url)
        const detail = await getPokemonDetails(p.url)
        if (detail) {
          const s: Record<string, number> = {}
          detail.stats.forEach(st => { s[st.stat.name] = st.base_stat })
          s.total = detail.stats.reduce((acc, st) => acc + st.base_stat, 0)
          statsCache.set(id, s)
        }
      }),
    )
    statsProgress.value = Math.min(100, Math.round(((i + BATCH) / missing.length) * 100))
  }
  loadingStats.value = false
}

watch(sortBy, sort => {
  if (isStatSort(sort)) loadStats(filteredPokemons.value)
})

async function applyTypeFilter(types: string[]) {
  if (!types.length) { typeFilteredNames.value = null; return }
  loadingTypes.value = true
  const results = await Promise.all(types.map(t => getPokemonByType(t)))
  const sets = results.map(names => new Set(names))
  typeFilteredNames.value = sets.reduce((acc, set) => new Set([...acc].filter(n => set.has(n))))
  loadingTypes.value = false
}

watch(selectedTypes, types => applyTypeFilter(types), { deep: true })

onMounted(async () => {
  if (!cachedPokemonList.value.length) {
    cachedPokemonList.value = await getPokemonList()
  }
  if (selectedTypes.value.length) {
    await applyTypeFilter(selectedTypes.value)
  }
})
</script>
