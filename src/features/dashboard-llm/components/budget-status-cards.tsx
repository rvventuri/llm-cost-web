import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BudgetStatus } from '@/lib/dashboard-api'

type BudgetStatusCardsProps = {
  budgetsStatus: BudgetStatus[]
}

export function BudgetStatusCards({ budgetsStatus }: BudgetStatusCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ok':
        return {
          icon: CheckCircle2,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          progressColor: 'bg-green-600',
          label: 'OK',
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          progressColor: 'bg-yellow-600',
          label: 'Atenção',
        }
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
          progressColor: 'bg-orange-600',
          label: 'Crítico',
        }
      case 'exceeded':
        return {
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          progressColor: 'bg-red-600',
          label: 'Excedido',
        }
      default:
        return {
          icon: Info,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/20',
          progressColor: 'bg-gray-600',
          label: 'Desconhecido',
        }
    }
  }

  const formatAmount = (value: number, type: 'tokens' | 'usd', showEstimate = false) => {
    if (type === 'usd') {
      const formatted = formatCurrency(value)
      return showEstimate ? `${formatted} (estimado)` : formatted
    }
    // Para tokens, não mostra estimado
    return `${formatNumber(value)} tokens`
  }

  const getPeriodLabel = (period: string) => {
    const labels: Record<string, string> = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
    }
    return labels[period] || period
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Status dos Budgets</CardTitle>
          <CardDescription>
            Monitoramento em tempo real dos seus budgets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {budgetsStatus.length > 0 ? (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {budgetsStatus.map((budgetStatus) => {
                const config = getStatusConfig(budgetStatus.consumption.status)
                const StatusIcon = config.icon

                return (
                  <Card key={budgetStatus.budget.id} className='border-2'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='text-base'>{budgetStatus.budget.name}</CardTitle>
                        <Badge
                          variant='outline'
                          className={cn('text-xs', config.bgColor, config.color)}
                        >
                          <StatusIcon className='h-3 w-3 mr-1' />
                          {config.label}
                        </Badge>
                      </div>
                      {budgetStatus.filter && (
                        <CardDescription className='text-xs mt-1'>
                          {budgetStatus.filter.type === 'general'
                            ? 'Geral'
                            : `${budgetStatus.filter.type}: ${budgetStatus.filter.name}`}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <div>
                        <div className='flex justify-between text-sm mb-1'>
                          <span className='text-muted-foreground'>Usado</span>
                          <span className='font-medium'>
                            {formatAmount(
                              budgetStatus.consumption.consumed,
                              budgetStatus.budget.type,
                              true
                            )}
                          </span>
                        </div>
                        <div className='w-full bg-muted rounded-full h-2'>
                          <div
                            className={cn('h-2 rounded-full transition-all', config.progressColor)}
                            style={{
                              width: `${Math.min(budgetStatus.consumption.percentage, 100)}%`,
                            }}
                          />
                        </div>
                        <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                          <span>{budgetStatus.consumption.percentage.toFixed(1)}%</span>
                          <span>
                            Restante:{' '}
                            {formatAmount(
                              budgetStatus.consumption.remaining,
                              budgetStatus.budget.type,
                              true
                            )}
                          </span>
                        </div>
                      </div>
                      <div className='text-xs text-muted-foreground pt-2 border-t'>
                        Limite: {formatAmount(budgetStatus.budget.amount, budgetStatus.budget.type, true)}{' '}
                        | {getPeriodLabel(budgetStatus.budget.period)}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground text-center py-4'>
              Nenhum budget encontrado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
