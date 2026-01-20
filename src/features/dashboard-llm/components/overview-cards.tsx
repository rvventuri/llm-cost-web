import { DollarSign, TrendingUp, TrendingDown, Minus, Zap, Activity } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { DashboardOverview } from '@/lib/dashboard-api'
import { cn } from '@/lib/utils'

type OverviewCardsProps = {
  overview: DashboardOverview
}

export function OverviewCards({ overview }: OverviewCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-red-600 dark:text-red-400'
    if (change < 0) return 'text-green-600 dark:text-green-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Cost (Estimado)</CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{formatCurrency(overview.totalCost)}</div>
          <p className='text-xs text-muted-foreground mt-1'>Valores são estimativas</p>
          <div className='flex items-center mt-2'>
            {overview.trends.costChange > 0 ? (
              <TrendingUp className={cn('h-4 w-4', getTrendColor(overview.trends.costChange))} />
            ) : overview.trends.costChange < 0 ? (
              <TrendingDown className={cn('h-4 w-4', getTrendColor(overview.trends.costChange))} />
            ) : (
              <Minus className={cn('h-4 w-4', getTrendColor(overview.trends.costChange))} />
            )}
            <span className={cn('ml-2 text-xs', getTrendColor(overview.trends.costChange))}>
              {Math.abs(overview.trends.costChange).toFixed(1)}% vs período anterior
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Tokens</CardTitle>
          <Zap className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{formatNumber(overview.totalTokens)}</div>
          <div className='flex items-center mt-2'>
            {overview.trends.tokensChange > 0 ? (
              <TrendingUp className={cn('h-4 w-4', getTrendColor(overview.trends.tokensChange))} />
            ) : overview.trends.tokensChange < 0 ? (
              <TrendingDown className={cn('h-4 w-4', getTrendColor(overview.trends.tokensChange))} />
            ) : (
              <Minus className={cn('h-4 w-4', getTrendColor(overview.trends.tokensChange))} />
            )}
            <span className={cn('ml-2 text-xs', getTrendColor(overview.trends.tokensChange))}>
              {Math.abs(overview.trends.tokensChange).toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Events</CardTitle>
          <Activity className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{formatNumber(overview.totalEvents)}</div>
          <div className='flex items-center mt-2'>
            {overview.trends.eventsChange > 0 ? (
              <TrendingUp className={cn('h-4 w-4', getTrendColor(overview.trends.eventsChange))} />
            ) : overview.trends.eventsChange < 0 ? (
              <TrendingDown className={cn('h-4 w-4', getTrendColor(overview.trends.eventsChange))} />
            ) : (
              <Minus className={cn('h-4 w-4', getTrendColor(overview.trends.eventsChange))} />
            )}
            <span className={cn('ml-2 text-xs', getTrendColor(overview.trends.eventsChange))}>
              {Math.abs(overview.trends.eventsChange).toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Avg Cost/Event (Estimado)</CardTitle>
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(overview.averageCostPerEvent)}
          </div>
          <p className='text-xs text-muted-foreground mt-1'>Valores são estimativas</p>
          <p className='text-xs text-muted-foreground mt-1'>
            Média por evento
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
