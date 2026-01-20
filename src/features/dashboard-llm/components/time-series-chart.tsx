import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
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

  // Garantir que os dados estão no formato correto
  const chartData = data
    .map((item) => {
      try {
        // Tentar parsear a data
        let dateStr = item.date
        let formattedDate = dateStr
        
        if (typeof dateStr === 'string') {
          try {
            // Tentar parseISO primeiro
            const parsedDate = parseISO(dateStr)
            if (!isNaN(parsedDate.getTime())) {
              formattedDate = format(parsedDate, 'dd/MM', { locale: ptBR })
            } else {
              // Se parseISO falhar, tentar new Date
              const dateObj = new Date(dateStr)
              if (!isNaN(dateObj.getTime())) {
                formattedDate = format(dateObj, 'dd/MM', { locale: ptBR })
              } else {
                // Se ambos falharem, usar a string original
                formattedDate = dateStr
              }
            }
          } catch {
            // Em caso de erro no parse, usar a string original
            formattedDate = dateStr
          }
        }
        
        return {
          date: formattedDate,
          cost: Number(item.cost || 0),
          fullDate: item.date,
        }
      } catch (error) {
        // Em caso de erro, retornar valores padrão
        return {
          date: String(item.date || ''),
          cost: Number(item.cost || 0),
          fullDate: item.date,
        }
      }
    })
    .filter((item) => item.cost > 0) // Filtrar itens vazios

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custos ao Longo do Tempo (Estimado)</CardTitle>
          <CardDescription>
            Evolução de custos ao longo do período. Valores em USD são estimativas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center h-[350px] text-muted-foreground'>
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custos ao Longo do Tempo (Estimado)</CardTitle>
        <CardDescription>
          Evolução de custos ao longo do período. Valores em USD são estimativas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart 
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' opacity={0.3} />
            <XAxis
              dataKey='date'
              stroke='hsl(var(--muted-foreground))'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor='end'
              height={60}
            />
            <YAxis
              stroke='hsl(var(--muted-foreground))'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                padding: '8px 12px',
              }}
              formatter={(value: any) => {
                if (value === undefined || value === null) return ''
                const numValue = typeof value === 'number' ? value : Number(value)
                if (isNaN(numValue)) return ''
                return formatCurrency(numValue)
              }}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Bar
              dataKey='cost'
              fill='hsl(var(--primary))'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
