import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { TimeSeriesData } from '@/lib/dashboard-api'

type TimeSeriesChartProps = {
  data: TimeSeriesData[]
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
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

  const chartData = data.map((item) => ({
    date: format(parseISO(item.date), 'dd/MM', { locale: ptBR }),
    cost: Number(item.cost.toFixed(2)),
    tokens: item.tokens,
    events: item.events,
    fullDate: item.date,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custos ao Longo do Tempo (Estimado)</CardTitle>
        <CardDescription>
          Evolução de custos, tokens e eventos ao longo do período. Valores em USD são estimativas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='date'
              stroke='hsl(var(--muted-foreground))'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId='left'
              stroke='hsl(var(--muted-foreground))'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <YAxis
              yAxisId='right'
              orientation='right'
              stroke='hsl(var(--muted-foreground))'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'cost') return formatCurrency(value)
                if (name === 'tokens') return formatNumber(value)
                return value
              }}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend />
            <Line
              yAxisId='left'
              type='monotone'
              dataKey='cost'
              stroke='hsl(var(--primary))'
              strokeWidth={2}
              dot={{ r: 3 }}
              name='Custo (USD - Estimado)'
            />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='tokens'
              stroke='hsl(var(--chart-1))'
              strokeWidth={2}
              dot={{ r: 3 }}
              name='Tokens'
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
