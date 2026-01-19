import api from './api'
import { AxiosError } from 'axios'

// Tipos baseados na documentação da API
export interface CreateLeadRequest {
  email: string
  telefone?: string
  plano: string
}

export interface Lead {
  id: number
  userId: number
  email: string
  telefone: string | null
  plano: string
  createdAt: string
  updatedAt: string
}

export interface CreateLeadResponse {
  success: boolean
  message: string
  data: Lead
}

// Função para criar lead
export async function createLead(
  data: CreateLeadRequest
): Promise<CreateLeadResponse> {
  try {
    const response = await api.post<CreateLeadResponse>('/leads', data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
      if (error.response?.status === 400) {
        const message =
          error.response.data?.message || 'Dados inválidos. Verifique os campos.'
        throw new Error(message)
      }
      if (error.response?.status === 404) {
        throw new Error('Usuário não encontrado')
      }
    }
    throw new Error('Erro ao criar lead. Tente novamente.')
  }
}
