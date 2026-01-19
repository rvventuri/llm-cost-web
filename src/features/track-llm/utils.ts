import type { TrackLLMEvent } from '@/lib/track-llm-api'
import type { LLMMetrics } from './data/schema'

export function calculateMetrics(events: TrackLLMEvent[]): LLMMetrics {
  const totalCost = events.reduce((sum, event) => sum + event.costInUsd, 0)
  const totalTokensIn = events.reduce((sum, event) => sum + event.tokensIn, 0)
  const totalTokensOut = events.reduce((sum, event) => sum + event.tokensOut, 0)
  const totalTokens = totalTokensIn + totalTokensOut
  const totalEvents = events.length
  const averageCostPerEvent = totalEvents > 0 ? totalCost / totalEvents : 0

  // Agrupar por provedor
  const providers: Record<string, { count: number; cost: number }> = {}
  events.forEach((event) => {
    if (!providers[event.provider]) {
      providers[event.provider] = { count: 0, cost: 0 }
    }
    providers[event.provider].count++
    providers[event.provider].cost += event.costInUsd
  })

  // Agrupar por modelo
  const models: Record<string, { count: number; cost: number }> = {}
  events.forEach((event) => {
    if (!models[event.model]) {
      models[event.model] = { count: 0, cost: 0 }
    }
    models[event.model].count++
    models[event.model].cost += event.costInUsd
  })

  return {
    totalCost,
    totalTokensIn,
    totalTokensOut,
    totalTokens,
    totalEvents,
    averageCostPerEvent,
    providers,
    models,
  }
}
