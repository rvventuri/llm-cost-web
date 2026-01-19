import { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { TrackLLMEvent } from '@/lib/track-llm-api'

type CostChartProps = {
  events: TrackLLMEvent[]
}

export function CostChart({ events }: CostChartProps) {
  const chartData = useMemo(() => {
    // Agrupar eventos por dia
    const dailyCosts: Record<string, number> = {}
    
    // Inicializar últimos 30 dias com zero
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateKey = format(date, 'yyyy-MM-dd')
      dailyCosts[dateKey] = 0
    }

    // Somar custos por dia
    events.forEach((event) => {
      const dateKey = format(new Date(event.createdAt), 'yyyy-MM-dd')
      if (dailyCosts[dateKey] !== undefined) {
        dailyCosts[dateKey] += event.costInUsd
      }
    })

    // Converter para array formatado
    return Object.entries(dailyCosts)
      .map(([date, cost]) => ({
        date: format(new Date(date), 'dd/MM', { locale: ptBR }),
        cost: Number(cost.toFixed(8)),
        fullDate: date,
      }))
      .slice(-30) // Últimos 30 dias
  }, [events])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custos ao Longo do Tempo</CardTitle>
        <CardDescription>
          Custo total em USD dos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey='date'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(6)}`}
            />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Bar
              dataKey='cost'
              fill='currentColor'
              radius={[4, 4, 0, 0]}
              className='fill-primary'
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
