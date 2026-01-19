import api from './api'
import { AxiosError } from 'axios'

// Tipos baseados na documentação da API
export interface TrackLLMEventFeature {
  id: number
  name: string
}

export interface TrackLLMEventTag {
  id: number
  name: string
}

export interface TrackLLMEvent {
  id: number
  provider: string
  model: string
  tokensIn: number
  tokensOut: number
  costInUsd: number
  inputCostPer1m: number | null
  outputCostPer1m: number | null
  feature: TrackLLMEventFeature | null
  tags: TrackLLMEventTag[]
  createdAt: string
  updatedAt: string
}

export interface TrackLLMResponse {
  success: boolean
  data: TrackLLMEvent[]
  total: number
}

export interface IsFirstEventResponse {
  success: boolean
  data: {
    isFirstEvent: boolean
  }
}

// Função para listar eventos de track LLM
export async function listTrackLLMEvents(): Promise<TrackLLMResponse> {
  try {
    const response = await api.get<TrackLLMResponse>('/track-llm')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
      if (error.response?.status === 500) {
        throw new Error('Erro interno do servidor')
      }
    }
    throw new Error('Erro ao buscar eventos de track LLM')
  }
}

// Função para verificar se é o primeiro evento
export async function checkIsFirstEvent(): Promise<IsFirstEventResponse> {
  try {
    const response = await api.get<IsFirstEventResponse>('/track-llm/is-first-event')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao verificar primeiro evento')
  }
}
