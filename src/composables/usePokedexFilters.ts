import { ref, computed } from 'vue'
import type { Pokemon } from '@/types/pokemon'

export const GENERATIONS = [
  { gen: 1, label: 'I', min: 1, max: 151 },
  { gen: 2, label: 'II', min: 152, max: 251 },
  { gen: 3, label: 'III', min: 252, max: 386 },
  { gen: 4, label: 'IV', min: 387, max: 493 },
  { gen: 5, label: 'V', min: 494, max: 649 },
  { gen: 6, label: 'VI', min: 650, max: 721 },
  { gen: 7, label: 'VII', min: 722, max: 809 },
  { gen: 8, label: 'VIII', min: 810, max: 905 },
  { gen: 9, label: 'IX', min: 906, max: 1025 },
]

export type SortKey =
  | 'number' | 'name' | 'total'
  | 'hp' | 'attack' | 'defense'
  | 'special-attack' | 'special-defense' | 'speed'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'number', label: 'Número' },
  { value: 'name', label: 'Nome' },
  { value: 'total', label: 'Total' },
  { value: 'hp', label: 'HP' },
  { value: 'attack', label: 'Ataque' },
  { value: 'defense', label: 'Defesa' },
  { value: 'special-attack', label: 'Atq. Especial' },
  { value: 'special-defense', label: 'Def. Especial' },
  { value: 'speed', label: 'Velocidade' },
]

export function isStatSort(key: SortKey): boolean {
  return !['number', 'name'].includes(key)
}

export function getPokemonIdFromUrl(url: string): number {
  return Number(url.split('/')[6])
}

const searchQuery = ref('')
const selectedGens = ref<number[]>([])
const selectedTypes = ref<string[]>([])
const sortBy = ref<SortKey>('number')
const showFilterDrawer = ref(false)
const showDesktopFilters = ref(false)
const cachedPokemonList = ref<Pokemon[]>([])
const lastViewedId = ref<number | null>(null)

const activeFilterCount = computed(
  () => selectedGens.value.length + selectedTypes.value.length,
)

function toggleGen(gen: number) {
  const i = selectedGens.value.indexOf(gen)
  if (i >= 0) selectedGens.value.splice(i, 1)
  else selectedGens.value.push(gen)
}

function toggleType(type: string) {
  const i = selectedTypes.value.indexOf(type)
  if (i >= 0) selectedTypes.value.splice(i, 1)
  else selectedTypes.value.push(type)
}

function clearFilters() {
  selectedGens.value = []
  selectedTypes.value = []
  sortBy.value = 'number'
  searchQuery.value = ''
}

export function usePokedexFilters() {
  return {
    searchQuery,
    selectedGens,
    selectedTypes,
    sortBy,
    showFilterDrawer,
    showDesktopFilters,
    cachedPokemonList,
    lastViewedId,
    activeFilterCount,
    GENERATIONS,
    SORT_OPTIONS,
    isStatSort,
    toggleGen,
    toggleType,
    clearFilters,
    getPokemonIdFromUrl,
  }
}
