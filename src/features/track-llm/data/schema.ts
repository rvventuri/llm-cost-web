import { z } from 'zod'
import type { TrackLLMEvent } from '@/lib/track-llm-api'

// Schema para validação se necessário
export const trackLLMEventFeatureSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const trackLLMEventTagSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const trackLLMEventSchema = z.object({
  id: z.number(),
  provider: z.string(),
  model: z.string(),
  tokensIn: z.number(),
  tokensOut: z.number(),
  costInUsd: z.number(),
  inputCostPer1m: z.number().nullable(),
  outputCostPer1m: z.number().nullable(),
  feature: trackLLMEventFeatureSchema.nullable(),
  tags: z.array(trackLLMEventTagSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type { TrackLLMEvent }

// Tipos auxiliares para métricas
export interface LLMMetrics {
  totalCost: number
  totalTokensIn: number
  totalTokensOut: number
  totalTokens: number
  totalEvents: number
  averageCostPerEvent: number
  providers: Record<string, { count: number; cost: number }>
  models: Record<string, { count: number; cost: number }>
}
