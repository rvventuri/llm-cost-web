import api from './api'
import { AxiosError } from 'axios'

// Tipos baseados na documentação da API
export interface Organization {
  id: number
  name: string
}

export interface User {
  id: number
  name: string
  email: string
  organizationId: number
  organization: Organization | null
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

// Função para fazer cadastro
export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        throw new Error('Email já está em uso')
      }
      if (error.response?.status === 400) {
        const message =
          error.response.data?.message || 'Dados inválidos. Verifique os campos.'
        throw new Error(message)
      }
    }
    throw new Error('Erro ao criar conta. Tente novamente.')
  }
}

// Função para fazer login
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Email ou senha inválidos')
      }
      if (error.response?.status === 400) {
        const message =
          error.response.data?.message || 'Dados inválidos. Verifique os campos.'
        throw new Error(message)
      }
    }
    throw new Error('Erro ao fazer login. Tente novamente.')
  }
}

// Função para buscar perfil do usuário
export async function getProfile(): Promise<User> {
  try {
    const response = await api.get<User>('/auth/profile')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Token inválido ou expirado')
      }
    }
    throw new Error('Erro ao buscar perfil do usuário')
  }
}
