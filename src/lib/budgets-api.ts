import api from './api'
import { AxiosError } from 'axios'

// Tipos baseados na documentação da API
export interface BudgetFeature {
  id: number
  name: string
}

export interface BudgetTag {
  id: number
  name: string
}

export interface BudgetProvider {
  id: number
  name: string
}

export interface BudgetModel {
  id: number
  name: string
  provider: BudgetProvider | null
}

export interface Budget {
  id: number
  organizationId: number
  name: string
  description: string | null
  amount: number
  type: 'tokens' | 'usd'
  period: 'daily' | 'weekly' | 'monthly'
  feature: BudgetFeature | null
  tag: BudgetTag | null
  model: BudgetModel | null
  provider: BudgetProvider | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBudgetRequest {
  name: string
  description?: string | null
  amount: number
  type: 'tokens' | 'usd'
  period: 'daily' | 'weekly' | 'monthly'
  featureId?: number | null
  tagId?: number | null
  modelId?: number | null
  providerId?: number | null
  isActive?: boolean
}

export interface UpdateBudgetRequest {
  name?: string
  description?: string | null
  amount?: number
  type?: 'tokens' | 'usd'
  period?: 'daily' | 'weekly' | 'monthly'
  featureId?: number | null
  tagId?: number | null
  modelId?: number | null
  providerId?: number | null
  isActive?: boolean
}

export interface CreateBudgetResponse {
  success: boolean
  message: string
  data: Budget
}

export interface ListBudgetsResponse {
  success: boolean
  data: Budget[]
  total: number
}

export interface GetBudgetResponse {
  success: boolean
  data: Budget
}

export interface DeleteBudgetResponse {
  success: boolean
  message: string
}

// Função para criar Budget
export async function createBudget(
  data: CreateBudgetRequest
): Promise<CreateBudgetResponse> {
  try {
    const response = await api.post<CreateBudgetResponse>('/budgets', data)
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
    throw new Error('Erro ao criar budget. Tente novamente.')
  }
}

// Função para listar Budgets
export async function listBudgets(): Promise<ListBudgetsResponse> {
  try {
    const response = await api.get<ListBudgetsResponse>('/budgets')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao listar budgets')
  }
}

// Função para buscar Budget específico
export async function getBudget(id: number): Promise<GetBudgetResponse> {
  try {
    const response = await api.get<GetBudgetResponse>(`/budgets/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
      if (error.response?.status === 404) {
        throw new Error('Budget não encontrado')
      }
    }
    throw new Error('Erro ao buscar budget')
  }
}

// Função para atualizar Budget
export async function updateBudget(
  id: number,
  data: UpdateBudgetRequest
): Promise<CreateBudgetResponse> {
  try {
    const response = await api.patch<CreateBudgetResponse>(
      `/budgets/${id}`,
      data
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
      if (error.response?.status === 404) {
        throw new Error('Budget não encontrado')
      }
      if (error.response?.status === 400) {
        const message =
          error.response.data?.message || 'Dados inválidos. Verifique os campos.'
        throw new Error(message)
      }
    }
    throw new Error('Erro ao atualizar budget')
  }
}

// Função para deletar Budget
export async function deleteBudget(id: number): Promise<DeleteBudgetResponse> {
  try {
    const response = await api.delete<DeleteBudgetResponse>(`/budgets/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
      if (error.response?.status === 404) {
        throw new Error('Budget não encontrado')
      }
    }
    throw new Error('Erro ao deletar budget')
  }
}
