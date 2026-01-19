import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TrackLLMEvent } from '@/lib/track-llm-api'
import type { LLMMetrics } from '../data/schema'

type ProviderBreakdownProps = {
  metrics: LLMMetrics
}

export function ProviderBreakdown({ metrics }: ProviderBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(value)
  }

  // Ordenar provedores por custo
  const sortedProviders = Object.entries(metrics.providers)
    .map(([provider, data]) => ({
      provider,
      ...data,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5) // Top 5

  // Ordenar modelos por custo
  const sortedModels = Object.entries(metrics.models)
    .map(([model, data]) => ({
      model,
      ...data,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5) // Top 5

  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Top Provedores</CardTitle>
          <CardDescription>Por custo total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {sortedProviders.length > 0 ? (
              sortedProviders.map(({ provider, count, cost }) => (
                <div
                  key={provider}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>{provider}</Badge>
                    <span className='text-sm text-muted-foreground'>
                      {count} eventos
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium'>{formatCurrency(cost)}</div>
                    <div className='text-xs text-muted-foreground'>
                      {metrics.totalCost > 0
                        ? ((cost / metrics.totalCost) * 100).toFixed(1)
                        : '0'}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                Nenhum evento encontrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Modelos</CardTitle>
          <CardDescription>Por custo total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {sortedModels.length > 0 ? (
              sortedModels.map(({ model, count, cost }) => (
                <div
                  key={model}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-sm'>{model}</span>
                    <span className='text-sm text-muted-foreground'>
                      {count} eventos
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium'>{formatCurrency(cost)}</div>
                    <div className='text-xs text-muted-foreground'>
                      {metrics.totalCost > 0
                        ? ((cost / metrics.totalCost) * 100).toFixed(1)
                        : '0'}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                Nenhum evento encontrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
