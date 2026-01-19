import api from './api'
import { AxiosError } from 'axios'

// Tipos baseados na documentação da API
export interface Organization {
  id: number
  name: string
}

export interface ApiKey {
  id: number
  name: string | null
  isActive: boolean
  lastUsedAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  organization: Organization | null
}

export interface CreateApiKeyRequest {
  name?: string
  expiresAt?: string
}

export interface CreateApiKeyResponse {
  message: string
  apiKey: string // A API key completa (só aparece na criação)
  apiKeyRecord: ApiKey
}

export interface UpdateApiKeyRequest {
  name?: string
  isActive?: boolean
  expiresAt?: string | null
}

// Função para criar API Key
export async function createApiKey(
  data: CreateApiKeyRequest
): Promise<CreateApiKeyResponse> {
  try {
    const response = await api.post<CreateApiKeyResponse>(
      '/organization-api-keys',
      data
    )
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
    }
    throw new Error('Erro ao criar API key. Tente novamente.')
  }
}

// Função para listar API Keys
export async function listApiKeys(): Promise<ApiKey[]> {
  try {
    const response = await api.get<ApiKey[]>('/organization-api-keys')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao listar API keys')
  }
}

// Função para buscar API Key específica
export async function getApiKey(id: number): Promise<ApiKey> {
  try {
    const response = await api.get<ApiKey>(`/organization-api-keys/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
      if (error.response?.status === 404) {
        throw new Error('API key não encontrada')
      }
    }
    throw new Error('Erro ao buscar API key')
  }
}

// Função para atualizar API Key
export async function updateApiKey(
  id: number,
  data: UpdateApiKeyRequest
): Promise<ApiKey> {
  try {
    const response = await api.patch<ApiKey>(
      `/organization-api-keys/${id}`,
      data
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
      if (error.response?.status === 404) {
        throw new Error('API key não encontrada')
      }
      if (error.response?.status === 400) {
        const message =
          error.response.data?.message || 'Dados inválidos. Verifique os campos.'
        throw new Error(message)
      }
    }
    throw new Error('Erro ao atualizar API key')
  }
}

// Função para deletar API Key
export async function deleteApiKey(id: number): Promise<void> {
  try {
    await api.delete(`/organization-api-keys/${id}`)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
      if (error.response?.status === 404) {
        throw new Error('API key não encontrada')
      }
    }
    throw new Error('Erro ao deletar API key')
  }
}
