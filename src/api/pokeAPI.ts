import axios from 'axios'
import { apiErrorAlert } from '@/utils/alerts'
import type { Pokemon, PokemonDetail } from '@/types/pokemon'
import type { PokemonSpecies, EvolutionChain } from '@/types/species'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
})

const detailCache    = new Map<string, PokemonDetail>()
const speciesCache   = new Map<number, PokemonSpecies>()
const evolutionCache = new Map<string, EvolutionChain>()
const typeCache      = new Map<string, string[]>()
const typeRelCache   = new Map<string, TypeDamageRelations>()
const abilityCache   = new Map<string, string>()

export interface TypeDamageRelations {
  double_damage_from: { name: string }[]
  half_damage_from:   { name: string }[]
  no_damage_from:     { name: string }[]
}

interface PokemonListResponse { results: Pokemon[] }

export const getPokemonList = async (limit = 1025): Promise<Pokemon[]> => {
  try {
    const { data } = await api.get<PokemonListResponse>(`/pokemon?offset=0&limit=${limit}`)
    return data.results
  } catch (error) {
    console.error('Erro ao obter a lista de Pokémons:', error)
    apiErrorAlert('Erro ao obter a lista de Pokémons.')
    return []
  }
}

export const getPokemonDetails = async (url: string): Promise<PokemonDetail | null> => {
  if (detailCache.has(url)) return detailCache.get(url)!
  try {
    const { data } = await api.get<PokemonDetail>(url)
    detailCache.set(url, data)
    return data
  } catch (error) {
    console.error('Erro ao obter os detalhes do Pokémon:', error)
    apiErrorAlert('Erro ao obter os detalhes do Pokémon.')
    return null
  }
}

export const getPokemonById = async (id: number): Promise<PokemonDetail | null> =>
  getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}/`)

export const getPokemonByType = async (type: string): Promise<string[]> => {
  if (typeCache.has(type)) return typeCache.get(type)!
  try {
    const { data } = await api.get<{ pokemon: { pokemon: { name: string } }[] }>(`/type/${type}`)
    const names = data.pokemon.map(p => p.pokemon.name)
    typeCache.set(type, names)
    return names
  } catch (error) {
    console.error('Erro ao filtrar por tipo:', error)
    apiErrorAlert('Erro ao filtrar por tipo.')
    return []
  }
}

export const getPokemonSpecies = async (id: number): Promise<PokemonSpecies | null> => {
  if (speciesCache.has(id)) return speciesCache.get(id)!
  try {
    const { data } = await api.get<PokemonSpecies>(`/pokemon-species/${id}`)
    speciesCache.set(id, data)
    return data
  } catch (error) {
    console.error('Erro ao obter espécie:', error)
    return null
  }
}

export const getEvolutionChain = async (url: string): Promise<EvolutionChain | null> => {
  if (evolutionCache.has(url)) return evolutionCache.get(url)!
  try {
    const { data } = await api.get<EvolutionChain>(url)
    evolutionCache.set(url, data)
    return data
  } catch (error) {
    console.error('Erro ao obter cadeia de evolução:', error)
    return null
  }
}

export const getTypeDamageRelations = async (typeName: string): Promise<TypeDamageRelations | null> => {
  if (typeRelCache.has(typeName)) return typeRelCache.get(typeName)!
  try {
    const { data } = await api.get<{ damage_relations: TypeDamageRelations }>(`/type/${typeName}`)
    typeRelCache.set(typeName, data.damage_relations)
    return data.damage_relations
  } catch {
    return null
  }
}

export const getAbilityDescription = async (url: string): Promise<string> => {
  if (abilityCache.has(url)) return abilityCache.get(url)!
  try {
    const { data } = await api.get<{
      effect_entries: { short_effect: string; language: { name: string } }[]
      flavor_text_entries: { flavor_text: string; language: { name: string }; version_group: { name: string } }[]
    }>(url)
    const ptFlavor = data.flavor_text_entries.findLast(e => e.language.name === 'pt')
    const enEffect = data.effect_entries.find(e => e.language.name === 'en')?.short_effect ?? ''
    const desc = ptFlavor?.flavor_text.replace(/\s+/g, ' ').trim() ?? enEffect
    abilityCache.set(url, desc)
    return desc
  } catch {
    return ''
  }
}
