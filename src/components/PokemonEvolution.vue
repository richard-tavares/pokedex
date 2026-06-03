<template>
  <div v-if="chain.evolves_to.length >= 5" class="evo-radial">
    <div class="evo-node evo-radial-center" @click="emit('select', getIdFromUrl(chain.species.url))">
      <div class="rounded-xl pa-2 evo-avatar">
        <v-img :src="getSpriteUrl(chain.species.url)" :alt="chain.species.name" width="80" height="80" />
      </div>
      <span class="evo-name text-body-2 text-center mt-1">{{ formatName(chain.species.name) }}</span>
      <span v-if="detail" class="text-caption text-medium-emphasis">{{ detail }}</span>
    </div>
    <template v-for="(branch, i) in chain.evolves_to" :key="branch.species.name">
      <div class="evo-np-arrow" :style="numpadArrowPos(i)">
        <v-icon size="14" color="medium-emphasis" :style="{ transform: `rotate(${NP_SLOTS[i].angle}deg)` }">
          mdi-chevron-right
        </v-icon>
      </div>
      <div :style="numpadItemStyle(i)">
        <PokemonEvolution :chain="branch" @select="emit('select', $event)" />
      </div>
    </template>
  </div>

  <div v-else-if="chain.evolves_to.length >= 2" class="evo-fork">
    <div
      class="evo-node evo-fork-base"
      :style="{ gridRow: `1 / span ${chain.evolves_to.length}` }"
      @click="emit('select', getIdFromUrl(chain.species.url))"
    >
      <div class="rounded-xl pa-2 evo-avatar">
        <v-img :src="getSpriteUrl(chain.species.url)" :alt="chain.species.name" width="80" height="80" />
      </div>
      <span class="evo-name text-body-2 text-center mt-1">{{ formatName(chain.species.name) }}</span>
      <span v-if="detail" class="text-caption text-medium-emphasis">{{ detail }}</span>
    </div>
    <template v-for="(branch, i) in chain.evolves_to" :key="branch.species.name">
      <div class="evo-fork-arrow">
        <v-icon
          size="16"
          color="medium-emphasis"
          :style="{ transform: `rotate(${fanAngle(i, chain.evolves_to.length)}deg)` }"
        >mdi-chevron-right</v-icon>
      </div>
      <PokemonEvolution :chain="branch" @select="emit('select', $event)" />
    </template>
  </div>

  <div v-else class="d-flex align-center ga-2">
    <div class="d-flex flex-column align-center evo-node" @click="emit('select', getIdFromUrl(chain.species.url))">
      <div class="rounded-xl pa-2 evo-avatar">
        <v-img :src="getSpriteUrl(chain.species.url)" :alt="chain.species.name" width="80" height="80" />
      </div>
      <span class="evo-name text-body-2 text-center mt-1">{{ formatName(chain.species.name) }}</span>
      <span v-if="detail" class="text-caption text-medium-emphasis">{{ detail }}</span>
    </div>
    <template v-if="chain.evolves_to.length === 1">
      <div class="evo-arrow-wrap">
        <v-icon size="16" color="medium-emphasis">mdi-chevron-right</v-icon>
      </div>
      <PokemonEvolution :chain="chain.evolves_to[0]" @select="emit('select', $event)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ChainLink, EvolutionDetail } from '@/types/species'

const props = defineProps<{ chain: ChainLink }>()
const emit = defineEmits<{ (e: 'select', id: number): void }>()

const getIdFromUrl = (url: string) => Number(url.split('/').findLast(Boolean))
const getSpriteUrl = (url: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getIdFromUrl(url)}.png`
const formatName = (name: string) =>
  name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

const TIME_LABELS: Record<string, string>  = { day: 'Dia', night: 'Noite' }
const STATS_LABELS: Record<number, string> = { 1: 'Atq > Def', '-1': 'Def > Atq', 0: 'Atq = Def' }

const tradeLabel = (d: EvolutionDetail) =>
  d.trade_species ? `Troca c/ ${formatName(d.trade_species.name)}` : 'Troca'

const happinessLabel = (d: EvolutionDetail) => {
  const time = TIME_LABELS[d.time_of_day] ?? ''
  return time ? `Amizade (${time})` : 'Amizade'
}

const formatDetail = (details: EvolutionDetail[]): string => {
  if (!details?.length) return ''
  const d = details[0]
  if (d.min_level)            return `Nv. ${d.min_level}`
  if (d.item)                 return formatName(d.item.name)
  if (d.held_item)            return formatName(d.held_item.name)
  if (d.trigger?.name === 'trade') return tradeLabel(d)
  if (d.min_happiness)        return happinessLabel(d)
  if (d.min_affection)        return 'Carinho'
  if (d.time_of_day)          return TIME_LABELS[d.time_of_day] ?? ''
  if (d.known_move_type)      return `Mov. ${formatName(d.known_move_type.name)}`
  if (d.known_move)           return formatName(d.known_move.name)
  if (d.location)             return formatName(d.location.name)
  if (d.min_beauty)           return 'Beleza'
  if (d.needs_overworld_rain) return 'Chuva'
  if (d.turn_upside_down)     return 'De cabeça p/ baixo'
  return STATS_LABELS[d.relative_physical_stats ?? Number.NaN] ?? ''
}

const detail = computed(() => formatDetail(props.chain.evolution_details))

const FAN_ANGLES: Record<number, number[]> = {
  2: [-45, 45],
  3: [-35, 0, 35],
  4: [-45, -15, 15, 45],
}
const fanAngle = (i: number, n: number) => FAN_ANGLES[n]?.[i] ?? 0

const NP_SLOTS = [
  { dx:    0, dy: -170, angle:  -90 },
  { dx:    0, dy:  170, angle:   90 },
  { dx:  140, dy:    0, angle:    0 },
  { dx: -140, dy:    0, angle:  180 },
  { dx:  140, dy: -170, angle:  -51 },
  { dx: -140, dy:  170, angle:  130 },
  { dx: -140, dy: -170, angle: -130 },
  { dx:  140, dy:  170, angle:   51 },
]
const NP_CX = 210
const NP_CY = 250

const numpadItemStyle = (i: number) => {
  const s = NP_SLOTS[i]
  return {
    position:  'absolute' as const,
    left:      `${NP_CX + s.dx}px`,
    top:       `${NP_CY + s.dy}px`,
    transform: 'translate(-50%, -50%)',
  }
}

const numpadArrowPos = (i: number) => {
  const s = NP_SLOTS[i]
  return {
    left: `${NP_CX + s.dx * 0.42}px`,
    top:  `${NP_CY - 18 + s.dy * 0.42}px`,
  }
}
</script>

<style scoped>
.evo-node {
  cursor: pointer;
  min-height: 160px;
}

.evo-avatar {
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
}

.evo-node:hover .evo-avatar {
  background: rgba(255, 255, 255, 0.12);
}

.evo-name {
  max-width: 80px;
  line-height: 1.2;
}

.evo-arrow-wrap {
  height: 160px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 40px;
  flex-shrink: 0;
}

.evo-fork {
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
  gap: 8px 8px;
}

.evo-fork-base {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.evo-fork-arrow {
  height: 160px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 40px;
}

.evo-np-arrow {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.evo-radial {
  position: relative;
  width: 420px;
  height: 500px;
  flex-shrink: 0;
}

.evo-radial-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 960px) {
  .evo-name {
    max-width: 110px;
  }
}
</style>
