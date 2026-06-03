<template>
  <div>

    <template v-if="loading">
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="image" height="270" />
        </v-col>
        <v-col cols="12" md="6" class="pa-4 d-flex flex-column ga-3">
          <v-skeleton-loader type="heading" />
          <v-skeleton-loader type="list-item-three-line" />
          <v-skeleton-loader type="list-item-three-line" />
        </v-col>
      </v-row>
    </template>

    <template v-else-if="!pokemon">
      <div class="d-flex flex-column align-center justify-center text-medium-emphasis" style="min-height: 60vh; opacity: 0.4">
        <v-icon size="80" icon="mdi-pokeball" />
        <p class="text-h6 mt-4">Selecione um Pokémon</p>
      </div>
    </template>

    <template v-else>
      <v-row no-gutters>

        <v-col cols="12" md="6" class="detail-panel">
          <PokemonHeader
            :pokemon="currentPokemon"
            v-model:show-shiny="showShiny"
            @back="emit('back')"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-tabs v-model="activeTab" color="primary" align-tabs="center" density="comfortable">
            <v-tab value="stats">Estatísticas</v-tab>
            <v-tab value="weaknesses">Fraquezas</v-tab>
            <v-tab value="evolution">Evolução</v-tab>
            <v-tab value="forms" :disabled="!hasForms">Formas</v-tab>
          </v-tabs>

          <v-tabs-window v-model="activeTab" class="pt-2 bg-transparent">

            <v-tabs-window-item value="stats">
              <div class="px-5 py-4 d-flex flex-column ga-2">
                <div v-for="stat in formattedStats" :key="stat.name" class="d-flex align-center ga-3">
                  <span class="stat-label text-caption text-medium-emphasis text-right">{{ stat.label }}</span>
                  <v-progress-linear :model-value="stat.percentage" color="grey" rounded height="8" class="flex-grow-1" />
                  <span class="stat-value text-caption text-right">{{ stat.base }}</span>
                </div>
              </div>

              <v-divider />
              <div class="px-5 py-3 d-flex flex-column ga-2">
                <div class="d-flex align-center ga-3 text-caption">
                  <span class="info-label text-medium-emphasis">Altura</span>
                  <span>{{ (currentPokemon.height / 10).toFixed(1) }}m</span>
                </div>
                <div class="d-flex align-center ga-3 text-caption">
                  <span class="info-label text-medium-emphasis">Peso</span>
                  <span>{{ (currentPokemon.weight / 10).toFixed(1) }}kg</span>
                </div>
                <div class="d-flex align-center ga-3 text-caption">
                  <span class="info-label text-medium-emphasis">Taxa de captura</span>
                  <span>{{ captureRate ?? '—' }}</span>
                </div>
                <div class="d-flex align-center ga-3 text-caption">
                  <span class="info-label text-medium-emphasis">Gênero</span>
                  <span>{{ genderLabel }}</span>
                </div>
                <div class="d-flex align-center ga-3 text-caption">
                  <span class="info-label text-medium-emphasis">Grupo de ovos</span>
                  <span>{{ eggGroupLabel }}</span>
                </div>
              </div>

              <template v-if="abilities.length">
                <v-divider />
                <div class="px-5 py-3 d-flex flex-column ga-3">
                  <div v-for="ab in abilities" :key="ab.name">
                    <div class="d-flex align-center ga-2 mb-1">
                      <span class="text-body-2 font-weight-medium">{{ ab.label }}</span>
                      <v-chip v-if="ab.isHidden" size="x-small" variant="tonal" color="purple">Oculta</v-chip>
                    </div>
                    <p v-if="ab.description" class="text-caption text-medium-emphasis mb-0">{{ ab.description }}</p>
                  </div>
                </div>
              </template>
            </v-tabs-window-item>

            <v-tabs-window-item value="weaknesses">
              <div class="px-5 py-4">
                <div v-if="loadingWeaknesses" class="d-flex justify-center py-8">
                  <v-progress-circular indeterminate color="primary" />
                </div>
                <template v-else>
                  <template v-for="group in weaknessGroups" :key="group.label">
                    <div v-if="group.types.length" class="mb-4 text-center">
                      <p class="text-caption text-medium-emphasis mb-2">{{ group.label }}</p>
                      <div class="d-flex flex-wrap ga-1 justify-center">
                        <TypeChip v-for="t in group.types" :key="t" :type="typeInfoMap[t]" />
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="evolution">
              <div class="px-5 py-4">
                <div v-if="loadingSpecies" class="d-flex justify-center py-8">
                  <v-progress-circular indeterminate color="primary" />
                </div>
                <div v-else-if="evolutionChain" class="evo-scroll">
                  <PokemonEvolution :chain="evolutionChain.chain" @select="selectBySpeciesId" />
                </div>
                <p v-else class="text-center text-medium-emphasis py-8 text-body-2">Sem dados de evolução</p>
              </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="forms">
              <div class="pa-4">
                <div v-if="loadingSpecies" class="d-flex justify-center py-8">
                  <v-progress-circular indeterminate color="primary" />
                </div>
                <div v-else class="forms-grid">
                  <div v-for="form in varieties" :key="form.pokemon.name" class="d-flex flex-column align-center form-node" :class="{ selected: currentPokemon.name === form.pokemon.name }" @click="selectForm(form.pokemon.url, form.is_default)">
                    <div class="rounded-xl pa-2 form-avatar">
                      <v-img :src="getFormSprite(form.pokemon.url)" :alt="form.pokemon.name" height="80" width="80" />
                    </div>
                    <span class="text-body-2 text-center mt-1 form-name">{{ formatFormName(pokemon.name, form.pokemon.name) }}</span>
                  </div>
                </div>
              </div>
            </v-tabs-window-item>

          </v-tabs-window>
        </v-col>
      </v-row>
    </template>

  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import {
  getPokemonSpecies, getEvolutionChain, getPokemonDetails,
  getPokemonById, getTypeDamageRelations, getAbilityDescription,
  type TypeDamageRelations,
} from '@/api/pokeAPI'
import PokemonHeader from '@/components/PokemonHeader.vue'
import PokemonEvolution from '@/components/PokemonEvolution.vue'
import TypeChip from '@/components/TypeChip.vue'
import type { PokemonDetail } from '@/types/pokemon'
import type { EvolutionChain, PokemonSpeciesVariety } from '@/types/species'
import typeInfoRaw from '@/assets/types-info.json'

const typeInfoMap = typeInfoRaw as Record<string, { pt: string; color: string; foto: string }>

const props = defineProps<{
  pokemon: PokemonDetail | null
  loading: boolean
}>()

const emit = defineEmits<{ (e: 'back'): void }>()

const STAT_LABELS: Record<string, string> = {
  'hp': 'HP', 'attack': 'Ataque', 'defense': 'Defesa',
  'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', 'speed': 'Veloc.',
}

const EGG_GROUP_PT: Record<string, string> = {
  'monster': 'Monstro', 'water1': 'Água 1', 'water2': 'Água 2', 'water3': 'Água 3',
  'bug': 'Inseto', 'flying': 'Voador', 'ground': 'Campo', 'fairy': 'Fada',
  'plant': 'Planta', 'humanshape': 'Humanoide', 'mineral': 'Mineral',
  'indeterminate': 'Amorfo', 'ditto': 'Ditto', 'dragon': 'Dragão', 'no-eggs': 'Sem Ovo',
}

const showShiny       = ref(false)
const activeTab       = ref('stats')
const loadingSpecies  = ref(false)
const loadingWeaknesses = ref(false)
const evolutionChain  = ref<EvolutionChain | null>(null)
const varieties       = ref<PokemonSpeciesVariety[]>([])
const formPokemon     = ref<PokemonDetail | null>(null)
const captureRate     = ref<number | null>(null)
const genderRate      = ref<number | null>(null)
const eggGroups       = ref<string[]>([])
const weaknesses      = ref<Record<string, number>>({})
const abilities       = ref<{ name: string; label: string; isHidden: boolean; description: string }[]>([])

const currentPokemon = computed(() => formPokemon.value ?? props.pokemon!)
const hasForms       = computed(() => varieties.value.length > 0)

const formattedStats = computed(() => {
  if (!currentPokemon.value) return []
  return currentPokemon.value.stats.map(s => ({
    name: s.stat.name,
    label: STAT_LABELS[s.stat.name] ?? s.stat.name,
    base: s.base_stat,
    percentage: Math.round((s.base_stat / 255) * 100),
  }))
})

const genderLabel = computed(() => {
  if (genderRate.value === null) return '—'
  if (genderRate.value === -1)   return 'Sem gênero'
  if (genderRate.value === 0)    return '100% ♂'
  if (genderRate.value === 8)    return '100% ♀'
  const f = (genderRate.value / 8) * 100
  return `${100 - f}% ♂ / ${f}% ♀`
})

const eggGroupLabel = computed(() =>
  eggGroups.value.map(g => EGG_GROUP_PT[g] ?? g).join(', ') || '—',
)

const weaknessGroups = computed(() => [
  { label: 'Muito fraco (4×)',     types: Object.entries(weaknesses.value).filter(([, v]) => v === 4).map(([k]) => k) },
  { label: 'Fraco (2×)',          types: Object.entries(weaknesses.value).filter(([, v]) => v === 2).map(([k]) => k) },
  { label: 'Resistente (½×)',     types: Object.entries(weaknesses.value).filter(([, v]) => v === 0.5).map(([k]) => k) },
  { label: 'Muito resistente (¼×)', types: Object.entries(weaknesses.value).filter(([, v]) => v === 0.25).map(([k]) => k) },
  { label: 'Imune (0×)',          types: Object.entries(weaknesses.value).filter(([, v]) => v === 0).map(([k]) => k) },
])

function computeEffectiveness(relations: TypeDamageRelations[]): Record<string, number> {
  const eff: Record<string, number> = {}
  for (const rel of relations) {
    for (const t of rel.double_damage_from) eff[t.name] = (eff[t.name] ?? 1) * 2
    for (const t of rel.half_damage_from)   eff[t.name] = (eff[t.name] ?? 1) * 0.5
    for (const t of rel.no_damage_from)     eff[t.name] = 0
  }
  return eff
}

const formatFormName = (baseName: string, formName: string): string => {
  if (formName === baseName) return 'Normal'
  const suffix = formName.replace(`${baseName}-`, '')
  const map: Record<string, string> = {
    'mega': 'Mega', 'mega-x': 'Mega X', 'mega-y': 'Mega Y',
    'gmax': 'Gigantamax', 'alola': 'Alola', 'galar': 'Galar',
    'hisui': 'Hisui', 'paldea': 'Paldea',
  }
  return map[suffix] ?? suffix.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const getFormSprite = (url: string) => {
  const id = url.split('/').findLast(Boolean)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

const selectBySpeciesId = async (speciesId: number) => {
  formPokemon.value = await getPokemonById(speciesId)
}

const selectForm = async (url: string, isDefault: boolean) => {
  formPokemon.value = isDefault ? null : await getPokemonDetails(url)
}

async function loadWeaknesses(types: string[]) {
  loadingWeaknesses.value = true
  const relations = await Promise.all(types.map(t => getTypeDamageRelations(t)))
  weaknesses.value = computeEffectiveness(relations.filter(Boolean) as TypeDamageRelations[])
  loadingWeaknesses.value = false
}

watch(currentPokemon, (p) => {
  if (p) loadWeaknesses(p.types.map(t => t.type.name))
}, { immediate: true })

watch(() => props.pokemon, async (newPokemon) => {
  formPokemon.value = null
  showShiny.value   = false
  activeTab.value   = 'stats'
  evolutionChain.value = null
  varieties.value   = []
  captureRate.value = null
  genderRate.value  = null
  eggGroups.value   = []
  abilities.value   = []

  if (!newPokemon) return

  abilities.value = await Promise.all(
    newPokemon.abilities.map(async a => ({
      name: a.ability.name,
      label: a.ability.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      isHidden: a.is_hidden,
      description: await getAbilityDescription(a.ability.url),
    })),
  )

  loadingSpecies.value = true
  try {
    const species = await getPokemonSpecies(newPokemon.id)
    if (!species) return

    captureRate.value = species.capture_rate
    genderRate.value  = species.gender_rate
    eggGroups.value   = species.egg_groups.map(g => g.name)

    const altForms = species.varieties.filter(v => !v.is_default)
    if (altForms.length > 0) varieties.value = altForms

    evolutionChain.value = await getEvolutionChain(species.evolution_chain.url)
  } finally {
    loadingSpecies.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.detail-panel {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.evo-scroll {
  overflow-x: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  min-width: 72px;
}

.stat-value {
  min-width: 28px;
}

.info-label {
  min-width: 120px;
}

.forms-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.form-node {
  width: 100px;
  cursor: pointer;
}

.form-avatar {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  transition: background 0.15s, border-color 0.15s;
}

.form-node:hover .form-avatar,
.form-node.selected .form-avatar {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgb(var(--v-theme-primary));
}

.form-name {
  max-width: 96px;
  line-height: 1.2;
}
</style>
