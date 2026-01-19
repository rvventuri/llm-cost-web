import api from './api'
import { AxiosError } from 'axios'

// Tipos baseados na documentação da API
export interface DashboardPeriod {
  start: string
  end: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
}

export interface DashboardTrends {
  costChange: number
  tokensChange: number
  eventsChange: number
}

export interface DashboardOverview {
  totalCost: number
  totalTokens: number
  totalEvents: number
  averageCostPerEvent: number
  period: DashboardPeriod
  trends: DashboardTrends
}

export interface TimeSeriesData {
  date: string
  cost: number
  tokens: number
  events: number
}

export interface TopItem {
  id: number
  name: string
  cost: number
  tokens: number
  events: number
  percentage: number
}

export interface BudgetStatusFilter {
  type: 'feature' | 'tag' | 'model' | 'provider' | 'general'
  name: string
}

export interface BudgetStatusBudget {
  id: number
  name: string
  amount: number
  type: 'tokens' | 'usd'
  period: 'daily' | 'weekly' | 'monthly'
}

export interface BudgetStatusConsumption {
  consumed: number
  percentage: number
  status: 'ok' | 'warning' | 'critical' | 'exceeded'
  remaining: number
}

export interface BudgetStatus {
  budget: BudgetStatusBudget
  consumption: BudgetStatusConsumption
  filter?: BudgetStatusFilter
}

export interface DashboardData {
  overview: DashboardOverview
  timeSeries: TimeSeriesData[]
  topFeatures: TopItem[]
  topTags: TopItem[]
  topModels: TopItem[]
  topProviders: TopItem[]
  budgetsStatus: BudgetStatus[]
}

export interface DashboardParams {
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'week' | 'month'
  limit?: number
}

export interface DashboardResponse {
  success: boolean
  data: DashboardData
}

export interface OverviewResponse {
  success: boolean
  data: DashboardOverview
}

export interface TimeSeriesResponse {
  success: boolean
  data: TimeSeriesData[]
}

export interface TopItemsResponse {
  success: boolean
  data: TopItem[]
}

export interface BudgetsStatusResponse {
  success: boolean
  data: BudgetStatus[]
  total: number
}

// Função para obter dashboard completo
export async function getDashboard(
  params?: DashboardParams
): Promise<DashboardResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    if (params?.groupBy) queryParams.append('groupBy', params.groupBy)
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const url = `/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await api.get<DashboardResponse>(url)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao carregar dashboard')
  }
}

// Função para obter apenas overview
export async function getOverview(
  startDate?: string,
  endDate?: string
): Promise<OverviewResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const url = `/dashboard/overview${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await api.get<OverviewResponse>(url)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao carregar overview')
  }
}

// Função para obter time series
export async function getTimeSeries(
  startDate: string,
  endDate: string,
  groupBy: 'day' | 'week' | 'month' = 'day'
): Promise<TimeSeriesResponse> {
  try {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      groupBy,
    })

    const response = await api.get<TimeSeriesResponse>(
      `/dashboard/time-series?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao carregar time series')
  }
}

// Função para obter top features
export async function getTopFeatures(
  startDate?: string,
  endDate?: string,
  limit: number = 10
): Promise<TopItemsResponse> {
  try {
    const queryParams = new URLSearchParams({ limit: limit.toString() })
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const response = await api.get<TopItemsResponse>(
      `/dashboard/top/features?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao carregar top features')
  }
}

// Função para obter top tags
export async function getTopTags(
  startDate?: string,
  endDate?: string,
  limit: number = 10
): Promise<TopItemsResponse> {
  try {
    const queryParams = new URLSearchParams({ limit: limit.toString() })
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const response = await api.get<TopItemsResponse>(
      `/dashboard/top/tags?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao carregar top tags')
  }
}

// Função para obter top models
export async function getTopModels(
  startDate?: string,
  endDate?: string,
  limit: number = 10
): Promise<TopItemsResponse> {
  try {
    const queryParams = new URLSearchParams({ limit: limit.toString() })
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const response = await api.get<TopItemsResponse>(
      `/dashboard/top/models?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao carregar top models')
  }
}

// Função para obter top providers
export async function getTopProviders(
  startDate?: string,
  endDate?: string,
  limit: number = 10
): Promise<TopItemsResponse> {
  try {
    const queryParams = new URLSearchParams({ limit: limit.toString() })
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const response = await api.get<TopItemsResponse>(
      `/dashboard/top/providers?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao carregar top providers')
  }
}

// Função para obter status dos budgets
export async function getBudgetsStatus(): Promise<BudgetsStatusResponse> {
  try {
    const response = await api.get<BudgetsStatusResponse>(
      '/dashboard/budgets/status'
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao carregar status dos budgets')
  }
}
