import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TopItem } from '@/lib/dashboard-api'

type TopRankingsProps = {
  title: string
  data: TopItem[]
  type?: 'features' | 'tags' | 'models' | 'providers'
}

export function TopRankings({ title, data }: TopRankingsProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Por custo total (valores em USD são estimativas)</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className='space-y-4'>
            {data.map((item) => (
              <div key={item.id} className='flex items-center justify-between'>
                <div className='flex items-center gap-3 flex-1'>
                  <Badge variant='outline' className='font-medium'>
                    {item.name}
                  </Badge>
                  <span className='text-sm text-muted-foreground'>
                    {formatNumber(item.events)} eventos
                  </span>
                </div>
                <div className='text-right min-w-[120px]'>
                  <div className='font-medium'>{formatCurrency(item.cost)}</div>
                  <div className='text-xs text-muted-foreground'>
                    {item.percentage.toFixed(1)}% <span className='text-[10px]'>(estimado)</span>
                  </div>
                </div>
                <div className='ml-4 w-24 bg-muted rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all'
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground text-center py-4'>
            Nenhum dado disponível
          </p>
        )}
      </CardContent>
    </Card>
  )
}
