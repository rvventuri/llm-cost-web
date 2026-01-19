import { DollarSign, TrendingUp, Zap, Activity } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { LLMMetrics } from '../data/schema'

type MetricsCardsProps = {
  metrics: LLMMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Custo Total</CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(metrics.totalCost)}
          </div>
          <p className='text-xs text-muted-foreground'>
            Média por evento: {formatCurrency(metrics.averageCostPerEvent)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total de Tokens</CardTitle>
          <Zap className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatNumber(metrics.totalTokens)}
          </div>
          <p className='text-xs text-muted-foreground'>
            {formatNumber(metrics.totalTokensIn)} entrada /{' '}
            {formatNumber(metrics.totalTokensOut)} saída
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total de Eventos</CardTitle>
          <Activity className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatNumber(metrics.totalEvents)}
          </div>
          <p className='text-xs text-muted-foreground'>
            {Object.keys(metrics.providers).length} provedores diferentes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Provedores</CardTitle>
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {Object.keys(metrics.providers).length}
          </div>
          <p className='text-xs text-muted-foreground'>
            {Object.keys(metrics.models).length} modelos únicos
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
